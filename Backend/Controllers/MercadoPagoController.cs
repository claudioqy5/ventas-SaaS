using System.Text.Json;
using MercadoPago.Client.Preference;
using MercadoPago.Config;
using MercadoPago.Resource.Preference;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Data;
using SaaS.API.Models;
using System.Security.Claims;

namespace SaaS.API.Controllers;

/// <summary>
/// Controlador para la integración con Mercado Pago Checkout Pro.
/// Crea preferencias de pago y procesa notificaciones webhook (IPN).
/// El Access Token se lee desde appsettings.json (nunca hardcodeado).
/// </summary>
[ApiController]
[Route("api/mercadopago")]
public class MercadoPagoController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IConfiguration _configuration;

    public MercadoPagoController(MongoDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // POST api/mercadopago/{empresaId}/preference
    // Crea una preferencia de Checkout Pro de Mercado Pago para una orden existente o nueva.
    // Requiere autenticación de cliente (JWT de la tienda virtual).
    // [Authorize] -> Permitimos acceso anónimo para "Modo Invitado"
    [AllowAnonymous]
    [HttpPost("{empresaId}/preference")]
    public async Task<IActionResult> CreatePreference(string empresaId, [FromBody] MpPreferenceRequest request)
    {
        var clientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        Client? client = null;

        if (!string.IsNullOrEmpty(clientId))
        {
            client = await _context.Clients.Find(c => c.Id == clientId && c.EmpresaId == empresaId).FirstOrDefaultAsync();
        }

        // Configurar el SDK con el Access Token desde appsettings.json
        var accessToken = _configuration["MercadoPago:AccessToken"];
        if (string.IsNullOrEmpty(accessToken))
            return StatusCode(500, new { message = "Mercado Pago no está configurado en el servidor." });

        MercadoPagoConfig.AccessToken = accessToken;

        // Construir los ítems de la preferencia
        var mpItems = request.Items.Select(item => new PreferenceItemRequest
        {
            Title = item.NombreProducto,
            Quantity = (int)item.Cantidad,
            UnitPrice = item.PrecioUnitario,
            CurrencyId = "PEN"   // Soles peruanos
        }).ToList();

        // URLs de retorno tras el pago
        var backUrl = request.BackUrl ?? "https://tienda.gruposercal.com";

        var preferenceRequest = new PreferenceRequest
        {
            Items = mpItems,
            Payer = new PreferencePayerRequest
            {
                Name    = client?.Nombres ?? client?.Nombre ?? "Invitado",
                Surname = client?.Apellidos ?? "",
                Email   = !string.IsNullOrEmpty(client?.Correo) ? client.Correo : null
            },
            BackUrls = new PreferenceBackUrlsRequest
            {
                Success = $"{backUrl}/pedido-confirmado?mp_status=approved&orderId={request.OrderId}",
                Failure = $"{backUrl}/checkout?mp_status=failure",
                Pending = $"{backUrl}/pedido-confirmado?mp_status=pending&orderId={request.OrderId}"
            },
            AutoReturn = "approved",
            // Notificación webhook al backend cuando se aprueba el pago
            NotificationUrl = $"{request.ServerBaseUrl}/api/mercadopago/{empresaId}/webhook",
            ExternalReference = request.OrderId,  // ID de la orden en MongoDB
            StatementDescriptor = "GRUPO SERCAL"
        };

        try
        {
            var preferenceClient = new PreferenceClient();
            Preference preference = await preferenceClient.CreateAsync(preferenceRequest);

            return Ok(new
            {
                preferenceId = preference.Id,
                initPoint = preference.InitPoint,         // URL de producción
                sandboxInitPoint = preference.SandboxInitPoint  // URL de sandbox (pruebas)
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Error al crear preferencia de Mercado Pago: {ex.Message}" });
        }
    }

    // POST api/mercadopago/{empresaId}/webhook
    // Recibe las notificaciones IPN/webhook de Mercado Pago.
    // Cuando el pago es aprobado, actualiza el EstadoPago y EstadoOrden de la venta.
    [AllowAnonymous]
    [HttpPost("{empresaId}/webhook")]
    public async Task<IActionResult> Webhook(string empresaId, [FromQuery] string? type, [FromQuery] string? topic, [FromQuery] string? id)
    {
        // Mercado Pago puede enviar la notificación con ?topic=payment&id=... (IPN) o
        // con ?type=payment (Webhooks modernos). Ambos se manejan aquí.

        var notificationType = type ?? topic;
        var notificationId   = id;

        // Leer el body para el nuevo formato de webhooks
        string body = string.Empty;
        try
        {
            using var reader = new System.IO.StreamReader(Request.Body);
            body = await reader.ReadToEndAsync();
        }
        catch { }

        if (!string.IsNullOrEmpty(body) && string.IsNullOrEmpty(notificationId))
        {
            try
            {
                var doc = JsonDocument.Parse(body);
                if (doc.RootElement.TryGetProperty("data", out var dataEl) && dataEl.TryGetProperty("id", out var dataId))
                    notificationId = dataId.GetString();
                if (doc.RootElement.TryGetProperty("type", out var typeEl))
                    notificationType = typeEl.GetString();
            }
            catch { }
        }

        if (notificationType != "payment" || string.IsNullOrEmpty(notificationId))
            return Ok(); // Ignorar notificaciones que no sean de pago

        // Configurar SDK
        var accessToken = _configuration["MercadoPago:AccessToken"];
        if (string.IsNullOrEmpty(accessToken)) return Ok();
        MercadoPagoConfig.AccessToken = accessToken;

        try
        {
            // Obtener información del pago desde la API de Mercado Pago
            var paymentClient = new MercadoPago.Client.Payment.PaymentClient();
            var payment = await paymentClient.GetAsync(long.Parse(notificationId));

            if (payment == null) return Ok();

            // El orderId que registramos como ExternalReference al crear la preferencia
            var orderId = payment.ExternalReference;

            if (string.IsNullOrEmpty(orderId)) return Ok();

            // Actualizar el estado de la orden en MongoDB según el estado del pago
            if (payment.Status == "approved")
            {
                var sale = await _context.Sales.Find(s => s.Id == orderId && s.EmpresaId == empresaId).FirstOrDefaultAsync();
                if (sale != null && sale.EstadoOrden == "PENDIENTE_PAGO")
                {
                    // Descontar stock
                    foreach (var item in sale.Detalles)
                    {
                        var productFilter = Builders<Product>.Filter.And(
                            Builders<Product>.Filter.Eq(p => p.Id, item.ProductoId),
                            Builders<Product>.Filter.Eq(p => p.EmpresaId, empresaId)
                        );
                        var product = await _context.Products.Find(productFilter).FirstOrDefaultAsync();
                        if (product != null)
                        {
                            var previousStock = product.Stock;
                            var newStock = previousStock - item.Cantidad;
                            await _context.Products.UpdateOneAsync(productFilter,
                                Builders<Product>.Update.Set(p => p.Stock, newStock));

                            var movement = new StockMovement
                            {
                                EmpresaId = empresaId,
                                ProductoId = product.Id,
                                NombreProducto = product.Nombre,
                                Tipo = "Confirmación Pedido Web",
                                Cantidad = item.Cantidad,
                                StockAnterior = previousStock,
                                StockNuevo = newStock,
                                Motivo = $"Pago Mercado Pago confirmado (ID: {sale.Id})",
                                CreadoPor = "SISTEMA",
                                CreadoPorNombre = "Mercado Pago Webhook",
                                FechaCreacion = DateTime.UtcNow
                            };
                            await _context.StockMovements.InsertOneAsync(movement);
                        }
                    }

                    var update = Builders<Sale>.Update
                        .Set(s => s.EstadoPago, "Pagado")
                        .Set(s => s.EstadoOrden, "EN_PREPARACION")
                        .Set(s => s.CodigoOperacionPago, notificationId) // Guardamos el ID del pago de MP
                        .Set(s => s.FechaConfirmacionPago, DateTime.UtcNow);

                    await _context.Sales.UpdateOneAsync(
                        s => s.Id == orderId && s.EmpresaId == empresaId,
                        update
                    );
                }
            }
            else if (payment.Status == "rejected" || payment.Status == "cancelled")
            {
                var update = Builders<Sale>.Update
                    .Set(s => s.EstadoPago, "Rechazado");

                await _context.Sales.UpdateOneAsync(
                    s => s.Id == orderId && s.EmpresaId == empresaId,
                    update
                );
            }
            // "pending" → no hacemos nada, la orden sigue en PENDIENTE_PAGO
        }
        catch (Exception ex)
        {
            // Logear el error pero siempre devolver 200 a MP para que no reintente
            Console.WriteLine($"[MP Webhook Error] {ex.Message}");
        }

        return Ok();
    }
}

// DTO para la solicitud de preferencia
public record MpPreferenceRequest(
    string? OrderId,
    List<MpItem> Items,
    string? BackUrl,
    string? ServerBaseUrl
);

public record MpItem(
    string NombreProducto,
    decimal Cantidad,
    decimal PrecioUnitario
);
