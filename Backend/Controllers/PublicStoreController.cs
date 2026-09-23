using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Data;
using SaaS.API.Models;
using SaaS.API.Services;

namespace SaaS.API.Controllers;

/// <summary>
/// Controlador público para tiendas virtuales y catálogos de clientes.
/// No requiere autenticación (AllowAnonymous) y filtra de forma estricta por EmpresaId.
/// Por seguridad comercial, NUNCA expone PrecioCosto ni información de proveedores.
/// </summary>
[ApiController]
[Route("api/public/store")]
public class PublicStoreController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;
    private readonly IEmailService _emailService;

    public PublicStoreController(
        MongoDbContext context, 
        IPasswordHasher passwordHasher, 
        IJwtProvider jwtProvider,
        IEmailService emailService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
        _emailService = emailService;
    }

    // GET api/public/store/{empresaId}
    [AllowAnonymous]
    [HttpGet("{empresaId}")]
    public async Task<IActionResult> GetStoreInfo(string empresaId)
    {
        if (string.IsNullOrWhiteSpace(empresaId))
            return BadRequest(new { message = "El identificador de la empresa es requerido." });

        var empresa = await _context.Empresas.Find(e => e.Id == empresaId && e.Activo).FirstOrDefaultAsync();
        if (empresa == null)
            return NotFound(new { message = "Tienda no encontrada o inactiva." });

        return Ok(new
        {
            empresa.Id,
            empresa.Nombre,
            empresa.PlanSuscripcion,
            empresa.Activo,
            empresa.BotWhatsAppActivo,
            empresa.NumeroWhatsAppBot,
            empresa.NumeroWhatsAppHumano
        });
    }

    // GET api/public/store/{empresaId}/products
    [AllowAnonymous]
    [HttpGet("{empresaId}/products")]
    public async Task<IActionResult> GetStoreProducts(string empresaId, [FromQuery] string? categoriaId = null)
    {
        if (string.IsNullOrWhiteSpace(empresaId))
            return BadRequest(new { message = "El identificador de la empresa es requerido." });

        var empresa = await _context.Empresas.Find(e => e.Id == empresaId && e.Activo).FirstOrDefaultAsync();
        if (empresa == null)
            return NotFound(new { message = "Tienda no encontrada o inactiva." });

        var filterBuilder = Builders<Product>.Filter;
        var filter = filterBuilder.Eq(p => p.EmpresaId, empresaId);

        if (!string.IsNullOrEmpty(categoriaId))
        {
            filter = filterBuilder.And(filter, filterBuilder.Eq(p => p.CategoriaId, categoriaId)); // Simplificado para compatibilidad si hay query string simple
        }

        var products = await _context.Products.Find(filter).ToListAsync();

        var publicProducts = products.Select(p => new
        {
            p.Id,
            p.Nombre,
            p.Descripcion,
            p.CodigoBarras,
            p.CategoriaId,
            p.CategoriaIds,
            p.TipoProducto,
            p.UnidadMedida,
            p.EsServicio,
            p.Precio,
            p.PrecioOferta,
            p.PrecioCostal,
            p.KilosPorCostal,
            p.Stock,
            p.ImagenUrl,
            p.Imagenes,
            p.CodigoModelo,
            p.Atributos
        });

        return Ok(publicProducts);
    }

    // GET api/public/store/{empresaId}/bot/products
    // Endpoint específico para la Inteligencia Artificial (n8n).
    // NO devuelve costos ni información de proveedores, pero sí descripciones e inventario.
    [AllowAnonymous]
    [HttpGet("{empresaId}/bot/products")]
    public async Task<IActionResult> GetBotStoreProducts(string empresaId)
    {
        if (string.IsNullOrWhiteSpace(empresaId))
            return BadRequest(new { message = "El identificador de la empresa es requerido." });

        var empresa = await _context.Empresas.Find(e => e.Id == empresaId && e.Activo).FirstOrDefaultAsync();
        if (empresa == null)
            return NotFound(new { message = "Tienda no encontrada o inactiva." });

        var products = await _context.Products.Find(p => p.EmpresaId == empresaId).ToListAsync();

        var botProducts = products.Select(p => new
        {
            p.Id,
            p.Nombre,
            p.Descripcion,
            p.CodigoBarras,
            p.TipoProducto,
            p.UnidadMedida,
            p.Precio,
            p.PrecioOferta,
            p.Stock,
            p.ImagenUrl,
            p.CodigoModelo,
            p.Atributos
        });

        return Ok(botProducts);
    }

    // GET api/public/store/{empresaId}/categories
    [AllowAnonymous]
    [HttpGet("{empresaId}/categories")]
    public async Task<IActionResult> GetStoreCategories(string empresaId)
    {
        if (string.IsNullOrWhiteSpace(empresaId))
            return BadRequest(new { message = "El identificador de la empresa es requerido." });

        var categories = await _context.Categories.Find(c => c.EmpresaId == empresaId).ToListAsync();
        return Ok(categories);
    }

    // POST api/public/store/{empresaId}/auth/register
    [AllowAnonymous]
    [HttpPost("{empresaId}/auth/register")]
    public async Task<IActionResult> RegisterClient(string empresaId, [FromBody] ClientRegisterRequest request)
    {
        var existing = await _context.Clients.Find(c => c.EmpresaId == empresaId && c.Correo == request.Correo).FirstOrDefaultAsync();

        var nombres = !string.IsNullOrWhiteSpace(request.Nombres)
            ? request.Nombres.Trim()
            : (!string.IsNullOrWhiteSpace(request.Nombre) ? request.Nombre.Trim().Split(' ')[0] : string.Empty);

        var apellidos = !string.IsNullOrWhiteSpace(request.Apellidos)
            ? request.Apellidos.Trim()
            : (!string.IsNullOrWhiteSpace(request.Nombre) ? string.Join(" ", request.Nombre.Trim().Split(' ').Skip(1)) : string.Empty);

        var nombreCompleto = $"{nombres} {apellidos}".Trim();
        if (string.IsNullOrWhiteSpace(nombreCompleto))
            nombreCompleto = request.Nombre ?? string.Empty;

        if (existing != null)
        {
            if (existing.EsUsuarioEcommerce)
                return BadRequest(new { message = "El correo ya está registrado en la tienda." });
            
            var tokenVerif = Guid.NewGuid().ToString("N");
            // Si ya existía como cliente de mostrador (POS), lo convertimos en cliente ecommerce
            existing.EsUsuarioEcommerce = true;
            existing.ClaveHash = _passwordHasher.Hash(request.Clave);
            existing.Nombres = !string.IsNullOrWhiteSpace(nombres) ? nombres : existing.Nombres;
            existing.Apellidos = !string.IsNullOrWhiteSpace(apellidos) ? apellidos : existing.Apellidos;
            existing.Nombre = !string.IsNullOrWhiteSpace(nombreCompleto) ? nombreCompleto : existing.Nombre;
            existing.Telefono = request.Telefono ?? existing.Telefono;
            existing.CorreoVerificado = false;
            existing.TokenVerificacion = tokenVerif;
            
            await _context.Clients.ReplaceOneAsync(c => c.Id == existing.Id, existing);

            // Despachar correo de activación VIP
            _ = _emailService.SendClientVerificationEmailAsync(existing.Correo, existing.Nombres ?? existing.Nombre, tokenVerif);

            return Ok(new { 
                message = "Cuenta creada con éxito. Por favor revisa tu bandeja de entrada o spam para verificar tu correo antes de iniciar sesión.", 
                requiresVerification = true 
            });
        }

        var tokenVerificacion = Guid.NewGuid().ToString("N");
        var newClient = new Client
        {
            EmpresaId = empresaId,
            Nombres = nombres,
            Apellidos = apellidos,
            Nombre = nombreCompleto,
            Correo = request.Correo,
            Telefono = request.Telefono ?? string.Empty,
            ClaveHash = _passwordHasher.Hash(request.Clave),
            EsUsuarioEcommerce = true,
            CorreoVerificado = false,
            TokenVerificacion = tokenVerificacion,
            FechaCreacion = DateTime.UtcNow
        };

        await _context.Clients.InsertOneAsync(newClient);

        // Despachar correo de activación VIP
        _ = _emailService.SendClientVerificationEmailAsync(newClient.Correo, newClient.Nombres ?? newClient.Nombre, tokenVerificacion);

        return Ok(new { 
            message = "Cuenta creada con éxito. Por favor revisa tu bandeja de entrada o spam para verificar tu correo antes de iniciar sesión.", 
            requiresVerification = true 
        });
    }

    // POST api/public/store/{empresaId}/auth/login
    [AllowAnonymous]
    [HttpPost("{empresaId}/auth/login")]
    public async Task<IActionResult> LoginClient(string empresaId, [FromBody] ClientLoginRequest request)
    {
        var client = await _context.Clients.Find(c => c.EmpresaId == empresaId && c.Correo == request.Correo && c.EsUsuarioEcommerce).FirstOrDefaultAsync();
        if (client == null || string.IsNullOrEmpty(client.ClaveHash) || !_passwordHasher.Verify(request.Clave, client.ClaveHash))
            return Unauthorized(new { message = "Correo o contraseña incorrectos." });

        if (!client.CorreoVerificado && !string.IsNullOrEmpty(client.TokenVerificacion))
        {
            return Unauthorized(new { message = "Por favor, verifica tu correo antes de ingresar. Revisa tu bandeja de entrada o spam." });
        }

        var token = _jwtProvider.GenerateClientToken(client);
        return Ok(new { token, client = new {
            client.Id,
            client.Nombre,
            client.Nombres,
            client.Apellidos,
            client.Correo,
            client.Telefono,
            client.TipoDocumento,
            client.NumeroDocumento,
            client.Direccion,
            client.Departamento,
            client.Provincia,
            client.Distrito,
            client.Referencia
        } });
    }

    // GET api/public/store/auth/verify-email?token=...
    [AllowAnonymous]
    [HttpGet("auth/verify-email")]
    public async Task<IActionResult> VerifyClientEmail([FromQuery] string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return BadRequest(new { message = "Token de verificación inválido." });

        var client = await _context.Clients.Find(c => c.TokenVerificacion == token).FirstOrDefaultAsync();
        if (client == null)
            return BadRequest(new { message = "El enlace de verificación es inválido o ya expiró." });

        var update = Builders<Client>.Update
            .Set(c => c.CorreoVerificado, true)
            .Set(c => c.TokenVerificacion, null);

        await _context.Clients.UpdateOneAsync(c => c.Id == client.Id, update);
        return Ok(new { message = "¡Correo verificado exitosamente! Ya puedes iniciar sesión con tu cuenta VIP." });
    }

    // POST api/public/store/{empresaId}/orders
    [AllowAnonymous]
    [HttpPost("{empresaId}/orders")]
    public async Task<IActionResult> SubmitOrder(string empresaId, [FromBody] StoreOrderRequest request)
    {
        string? clientId = null;
        Client? client = null;

        if (User.Identity != null && User.Identity.IsAuthenticated)
        {
            clientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            if (!string.IsNullOrEmpty(clientId))
            {
                client = await _context.Clients.Find(c => c.Id == clientId && c.EmpresaId == empresaId).FirstOrDefaultAsync();
            }
        }

        var nombreClienteFinal = !string.IsNullOrWhiteSpace(request.NombreCliente)
            ? request.NombreCliente.Trim()
            : (client != null ? client.Nombre : "Cliente Invitado (WhatsApp)");

        // Validar y crear la venta (Sale) con todos los datos de entrega y facturación.
        // Los datos son aislados por EmpresaId para garantizar la separación multi-tenant del SaaS.
        var newSale = new Sale
        {
            EmpresaId = empresaId,
            ClienteId = client?.Id,
            NombreCliente = nombreClienteFinal,
            Subtotal = request.Subtotal,
            Impuesto = request.Impuesto,
            Total = request.Total,
            MetodoPago = request.MetodoPago,
            EstadoPago = "Pendiente",
            EstadoOrden = "PENDIENTE_PAGO",
            CreadoPor = client?.Id,
            CreadoPorNombre = client != null ? "Tienda Virtual" : "Tienda Virtual (Invitado)",
            FechaCreacion = DateTime.UtcNow,
            Detalles = new List<SaleItem>(),

            // Datos de entrega
            DireccionEntrega = string.IsNullOrWhiteSpace(request.DireccionEntrega) ? "Coordinación directa por WhatsApp" : request.DireccionEntrega,
            DepartamentoEntrega = request.DepartamentoEntrega,
            ProvinciaEntrega = request.ProvinciaEntrega,
            DistritoEntrega = request.DistritoEntrega,
            ReferenciaEntrega = request.ReferenciaEntrega,

            // Datos del receptor
            EsEntregaATercero = request.EsEntregaATercero ?? false,
            NombreReceptor = request.NombreReceptor,
            DniReceptor = request.DniReceptor,
            NotasEntrega = request.NotasEntrega,

            // Datos de comprobante y pago
            TipoComprobante = request.TipoComprobante ?? "Boleta",
            RucFactura = request.RucFactura,
            RazonSocialFactura = request.RazonSocialFactura,
            DireccionFiscalFactura = request.DireccionFiscalFactura,
            CodigoOperacionPago = request.CodigoOperacionPago
        };

        foreach (var item in request.Items)
        {
            var product = await _context.Products.Find(p => p.Id == item.ProductoId).FirstOrDefaultAsync();
            if (product != null)
            {
                var saleItem = new SaleItem
                {
                    ProductoId = product.Id,
                    NombreProducto = product.Nombre,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = item.PrecioUnitario,
                    UnidadMedida = product.UnidadMedida,
                    CantidadPresentacion = 1,
                    PrecioPresentacion = item.PrecioUnitario,
                    Presentacion = "Unidad"
                };
                newSale.Detalles.Add(saleItem);
            }
            else
            {
                // Manejar error de producto inexistente
                return BadRequest(new { message = $"El producto {item.NombreProducto} no existe." });
            }
        }

        await _context.Sales.InsertOneAsync(newSale);

        if (client != null)
        {
            var updateDef = Builders<Client>.Update
                .Set(c => c.Direccion, request.DireccionEntrega ?? client.Direccion)
                .Set(c => c.Departamento, request.DepartamentoEntrega ?? client.Departamento)
                .Set(c => c.Provincia, request.ProvinciaEntrega ?? client.Provincia)
                .Set(c => c.Distrito, request.DistritoEntrega ?? client.Distrito)
                .Set(c => c.Referencia, request.ReferenciaEntrega ?? client.Referencia)
                .Set(c => c.TipoDocumento, request.TipoDocumento ?? client.TipoDocumento)
                .Set(c => c.NumeroDocumento, request.NumeroDocumento ?? client.NumeroDocumento);

            await _context.Clients.UpdateOneAsync(
                c => c.Id == client.Id && c.EmpresaId == empresaId,
                updateDef
            );
        }

        return Ok(new { message = "Pedido registrado con éxito", orderId = newSale.Id });
    }

    // GET api/public/store/{empresaId}/orders/me
    [Authorize]
    [HttpGet("{empresaId}/orders/me")]
    public async Task<IActionResult> GetMyOrders(string empresaId)
    {
        var clientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(clientId)) return Unauthorized();

        var sales = await _context.Sales.Find(s => s.EmpresaId == empresaId && s.ClienteId == clientId).SortByDescending(s => s.FechaCreacion).ToListAsync();
        
        return Ok(sales);
    }

    // PUT api/public/store/{empresaId}/profile
    [Authorize]
    [HttpPut("{empresaId}/profile")]
    public async Task<IActionResult> UpdateProfile(string empresaId, [FromBody] UpdateProfileRequest request)
    {
        var clientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(clientId)) return Unauthorized();

        var client = await _context.Clients.Find(c => c.Id == clientId && c.EmpresaId == empresaId).FirstOrDefaultAsync();
        if (client == null) return Unauthorized();

        var updateDef = Builders<Client>.Update
            .Set(c => c.Nombres, request.Nombres ?? client.Nombres)
            .Set(c => c.Apellidos, request.Apellidos ?? client.Apellidos)
            .Set(c => c.Nombre, $"{request.Nombres ?? client.Nombres} {request.Apellidos ?? client.Apellidos}".Trim())
            .Set(c => c.Telefono, request.Telefono ?? client.Telefono);

        await _context.Clients.UpdateOneAsync(
            c => c.Id == clientId && c.EmpresaId == empresaId,
            updateDef
        );

        return Ok(new { message = "Perfil actualizado con éxito" });
    }

    // =============================================
    // ENDPOINTS EXCLUSIVOS PARA EL BOT DE WHATSAPP
    // =============================================

    // POST api/public/store/{empresaId}/bot/orders
    // n8n llama a este endpoint cuando el cliente confirma un pedido por WhatsApp
    [AllowAnonymous]
    [HttpPost("{empresaId}/bot/orders")]
    public async Task<IActionResult> SubmitBotOrder(string empresaId, [FromBody] BotOrderRequest request)
    {
        try
        {
            if (request == null || request.Items == null || !request.Items.Any())
                return BadRequest(new { message = "El pedido no tiene productos." });

            var detalles = new List<SaleItem>();
            decimal total = 0;

            foreach (var item in request.Items)
            {
                var product = await _context.Products
                    .Find(p => p.Id == item.ProductoId && p.EmpresaId == empresaId)
                    .FirstOrDefaultAsync();

                if (product == null)
                    return BadRequest(new { message = $"El producto '{item.NombreProducto}' no existe o no pertenece a esta tienda." });

                detalles.Add(new SaleItem
                {
                    ProductoId = product.Id,
                    NombreProducto = product.Nombre,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = item.PrecioUnitario,
                    UnidadMedida = product.UnidadMedida,
                    CantidadPresentacion = 1,
                    PrecioPresentacion = item.PrecioUnitario,
                    Presentacion = "Unidad"
                });

                total += item.Cantidad * item.PrecioUnitario;
            }

            // Si el cliente de WhatsApp ya tiene registro en el sistema por su número, vincular su ObjectId
            string? clienteId = null;
            if (!string.IsNullOrWhiteSpace(request.WhatsAppCliente))
            {
                var digits = new string(request.WhatsAppCliente.Where(char.IsDigit).ToArray());
                var existingClient = await _context.Clients
                    .Find(c => c.EmpresaId == empresaId && (c.Telefono == request.WhatsAppCliente || (digits.Length >= 9 && c.Telefono.EndsWith(digits.Substring(digits.Length - 9)))))
                    .FirstOrDefaultAsync();
                if (existingClient != null)
                {
                    clienteId = existingClient.Id;
                }
            }

            var newSale = new Sale
            {
                EmpresaId = empresaId,
                ClienteId = clienteId, // null o ObjectId válido; NUNCA "WHATSAPP_BOT" porque ClienteId requiere formato ObjectId
                NombreCliente = !string.IsNullOrWhiteSpace(request.NombreCliente) ? request.NombreCliente : "Cliente WhatsApp",
                Detalles = detalles,
                Subtotal = total,
                Impuesto = 0,
                Total = total,
                MetodoPago = request.MetodoPago ?? "Yape",
                EstadoPago = "Pendiente",
                EstadoOrden = "PENDIENTE_PAGO",
                OrigenPedido = "WhatsAppBot",
                WhatsAppCliente = request.WhatsAppCliente,
                CreadoPor = null,
                CreadoPorNombre = "Bot WhatsApp",
                FechaCreacion = DateTime.UtcNow,
                DireccionEntrega = !string.IsNullOrWhiteSpace(request.DireccionEntrega) 
                    ? request.DireccionEntrega 
                    : (!string.IsNullOrWhiteSpace(request.DirecionEntrega) ? request.DirecionEntrega : "Coordinación por WhatsApp"),
                NotasEntrega = request.NotasEntrega,
                TipoComprobante = "Nota de Venta",
                CodigoTipoComprobanteSunat = "00",
                Serie = "NV01",
                ClienteTipoDocumento = "-"
            };

            await _context.Sales.InsertOneAsync(newSale);

            return Ok(new { message = "Pedido registrado exitosamente", orderId = newSale.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al registrar pedido del bot.", error = ex.Message });
        }
    }

    // POST api/public/store/bot/upload-image
    // n8n llama a este endpoint para subir la foto del comprobante de pago recibida por WhatsApp.
    // Recibe la imagen en base64 y la guarda en /uploads/images/, devuelve la URL pública.
    [AllowAnonymous]
    [HttpPost("bot/upload-image")]
    public async Task<IActionResult> UploadBotImage([FromBody] BotImageUploadRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.Base64Image))
            return BadRequest(new { message = "No se recibió imagen." });

        try
        {
            // Limpiar prefijo data:image/...;base64,
            var base64Data = request.Base64Image;
            if (base64Data.Contains(","))
                base64Data = base64Data.Split(',')[1];

            var bytes = Convert.FromBase64String(base64Data);
            var ext = request.Extension?.ToLowerInvariant() ?? ".jpg";
            if (!new[] { ".jpg", ".jpeg", ".png", ".webp" }.Contains(ext))
                ext = ".jpg";

            var fileName = $"{Guid.NewGuid()}{ext}";
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "images");
            Directory.CreateDirectory(uploadsPath);
            var filePath = Path.Combine(uploadsPath, fileName);

            await System.IO.File.WriteAllBytesAsync(filePath, bytes);

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var imageUrl = $"{baseUrl}/uploads/images/{fileName}";

            return Ok(new { url = imageUrl });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Error al procesar la imagen: {ex.Message}" });
        }
    }

    // POST api/public/store/{empresaId}/bot/orders/{orderId}/voucher
    // n8n llama a este endpoint para adjuntar la URL de la foto del comprobante al pedido.
    [AllowAnonymous]
    [HttpPost("{empresaId}/bot/orders/{orderId}/voucher")]
    public async Task<IActionResult> AddVoucherToOrder(string empresaId, string orderId, [FromBody] BotVoucherRequest request)
    {
        if (string.IsNullOrEmpty(request?.ImageUrl))
            return BadRequest(new { message = "Se requiere la URL de la imagen." });

        var order = await _context.Sales
            .Find(s => s.Id == orderId && s.EmpresaId == empresaId)
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound(new { message = "Pedido no encontrado." });

        var update = Builders<Sale>.Update
            .Push(s => s.ComprobantePagoUrls, request.ImageUrl);

        await _context.Sales.UpdateOneAsync(
            s => s.Id == orderId && s.EmpresaId == empresaId,
            update
        );

        return Ok(new { message = "Comprobante adjuntado al pedido." });
    }
}


public record ClientRegisterRequest(string? Nombre, string? Nombres, string? Apellidos, string Correo, string Clave, string? Telefono);
public record ClientLoginRequest(string Correo, string Clave);
public record UpdateProfileRequest(string? Nombres, string? Apellidos, string? Telefono);

/// <summary>
/// Solicitud de orden desde la tienda virtual. Incluye todos los datos de entrega,
/// receptor, comprobante y código de pago necesarios para el despacho del pedido.
/// Aislada por EmpresaId para garantizar la separación de datos en el SaaS.
/// </summary>
public record StoreOrderRequest(
    decimal Subtotal,
    decimal Impuesto,
    decimal Total,
    string MetodoPago,
    List<StoreOrderItem> Items,
    // Datos personales del comprador (para actualizar perfil o para invitado)
    string? NombreCliente,
    string? TipoDocumento,
    string? NumeroDocumento,
    // Datos de entrega
    string? DireccionEntrega,
    string? DepartamentoEntrega,
    string? ProvinciaEntrega,
    string? DistritoEntrega,
    string? ReferenciaEntrega,
    // Datos del receptor (si es un tercero)
    bool? EsEntregaATercero,
    string? NombreReceptor,
    string? DniReceptor,
    string? NotasEntrega,
    // Datos de comprobante
    string? TipoComprobante,
    string? RucFactura,
    string? RazonSocialFactura,
    string? DireccionFiscalFactura,
    // Código de operación de pago (Yape, Plin, Transferencia)
    string? CodigoOperacionPago
);

public record StoreOrderItem(string ProductoId, string NombreProducto, decimal Cantidad, decimal PrecioUnitario);

/// <summary>Solicitud de pedido desde el Bot de WhatsApp.</summary>
public record BotOrderRequest(
    string? NombreCliente,
    string? WhatsAppCliente,
    string? MetodoPago,
    string? DireccionEntrega,
    string? NotasEntrega,
    List<BotOrderItem> Items,
    string? DirecionEntrega = null
);

public record BotOrderItem(string ProductoId, string NombreProducto, decimal Cantidad, decimal PrecioUnitario);

/// <summary>Solicitud para subir una imagen en base64 recibida por WhatsApp.</summary>
public record BotImageUploadRequest(string Base64Image, string? Extension);

/// <summary>Solicitud para adjuntar URL de comprobante de pago a un pedido.</summary>
public record BotVoucherRequest(string ImageUrl);
