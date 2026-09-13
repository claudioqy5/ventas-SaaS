using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;

namespace SaaS.API.Controllers;

// Controlador de ventas: procesa las ventas del POS, descuenta el stock y registra el historial
// Rutas disponibles bajo: api/sales
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    // Constructor: inyecta la BD y el contexto del usuario actual
    public SalesController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    // GET api/sales — devuelve el historial de ventas de la empresa, del mas reciente al mas antiguo
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Validar los permisos del usuario actual
        if (!_userContext.HasPermission("historial_ventas"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Ordeno las ventas de la mas reciente a la mas antigua.
        // Se excluyen los fiados no pagados y los pedidos online en estado PENDIENTE_PAGO o CANCELADO.
        // Los pedidos online confirmados (EN_PREPARACION, ENVIADO, ENTREGADO) SI aparecen aqui.
        var sales = await _context.Sales.Find(s =>
            s.EmpresaId == empresaId &&
            s.EstadoPago != "Fiado" &&
            s.EstadoOrden != "PENDIENTE_PAGO" &&
            s.EstadoOrden != "CANCELADO"
        )
            .SortByDescending(s => s.FechaCreacion)
            .ToListAsync();

        return Ok(sales);
    }

    // GET api/sales/next-correlative?tipoComprobante=Boleta&serie=B001
    [HttpGet("next-correlative")]
    public async Task<IActionResult> GetNextCorrelative([FromQuery] string tipoComprobante = "Boleta", [FromQuery] string? serie = null)
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        string serieFinal = !string.IsNullOrWhiteSpace(serie) ? serie : (tipoComprobante switch
        {
            "Factura" => "F001",
            "Nota de Venta" => "NV01",
            _ => "B001"
        });

        var existingSeries = await _context.VoucherSeries.Find(s =>
            s.EmpresaId == empresaId &&
            s.TipoComprobante == tipoComprobante &&
            s.Serie == serieFinal
        ).FirstOrDefaultAsync();

        int siguienteNumero = (existingSeries?.UltimoNumero ?? 0) + 1;

        return Ok(new
        {
            tipoComprobante,
            serie = serieFinal,
            siguienteNumero,
            numeroComprobante = $"{serieFinal}-{siguienteNumero:D8}"
        });
    }

    // POST api/sales — registra una venta nueva, descuenta el stock y guarda el movimiento de inventario
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Sale sale)
    {
        // Confirmar si el usuario tiene habilitado el modulo de ventas
        if (!_userContext.HasPermission("ventas"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Normalizar tipo de comprobante
        sale.TipoComprobante = string.IsNullOrWhiteSpace(sale.TipoComprobante) ? "Boleta" : sale.TipoComprobante.Trim();

        // Validaciones fiscales según tipo de comprobante
        switch (sale.TipoComprobante)
        {
            case "Factura":
                sale.CodigoTipoComprobanteSunat = "01";
                sale.Serie = string.IsNullOrWhiteSpace(sale.Serie) ? "F001" : sale.Serie.Trim().ToUpper();
                sale.ClienteTipoDocumento = "6"; // 6 = RUC
                
                // Unificar RUC y Razón Social desde campos específicos o generales
                if (string.IsNullOrWhiteSpace(sale.ClienteNumeroDocumento))
                    sale.ClienteNumeroDocumento = sale.RucFactura;
                if (string.IsNullOrWhiteSpace(sale.ClienteRazonSocial))
                    sale.ClienteRazonSocial = sale.RazonSocialFactura;
                if (string.IsNullOrWhiteSpace(sale.ClienteDireccion))
                    sale.ClienteDireccion = sale.DireccionFiscalFactura;

                if (string.IsNullOrWhiteSpace(sale.ClienteNumeroDocumento) || sale.ClienteNumeroDocumento.Trim().Length != 11)
                {
                    return BadRequest(new { message = "Para emitir una Factura Electrónica se requiere un RUC válido de 11 dígitos." });
                }

                if (string.IsNullOrWhiteSpace(sale.ClienteRazonSocial))
                {
                    return BadRequest(new { message = "Para emitir una Factura Electrónica se requiere la Razón Social del cliente o empresa." });
                }

                sale.NombreCliente = sale.ClienteRazonSocial.Trim();
                sale.RucFactura = sale.ClienteNumeroDocumento.Trim();
                sale.RazonSocialFactura = sale.ClienteRazonSocial.Trim();
                sale.DireccionFiscalFactura = sale.ClienteDireccion?.Trim();
                break;

            case "Nota de Venta":
                sale.CodigoTipoComprobanteSunat = "00";
                sale.Serie = string.IsNullOrWhiteSpace(sale.Serie) ? "NV01" : sale.Serie.Trim().ToUpper();
                sale.ClienteTipoDocumento = "-";
                break;

            case "Boleta":
            default:
                sale.TipoComprobante = "Boleta";
                sale.CodigoTipoComprobanteSunat = "03";
                sale.Serie = string.IsNullOrWhiteSpace(sale.Serie) ? "B001" : sale.Serie.Trim().ToUpper();
                if (!string.IsNullOrWhiteSpace(sale.ClienteNumeroDocumento))
                {
                    sale.ClienteTipoDocumento = sale.ClienteNumeroDocumento.Trim().Length == 8 ? "1" : "6";
                }
                else
                {
                    sale.ClienteTipoDocumento = "-";
                }
                break;
        }

        // Preparo los datos de la venta antes de procesarla
        sale.Id = string.Empty;
        sale.EmpresaId = empresaId;
        sale.CreadoPor = _userContext.UserId ?? string.Empty;

        // Extraigo el nombre del vendedor desde el token JWT para dejarlo en el registro
        var nameClaim = User.FindFirst("name")?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value
            ?? "Empleado";
        sale.CreadoPorNombre = nameClaim;
        sale.FechaCreacion = DateTime.UtcNow;

        decimal computedTotal = 0;

        // Recorro cada producto del carrito para descontar el stock correspondiente
        foreach (var item in sale.Detalles)
        {
            var productFilter = Builders<Product>.Filter.And(
                Builders<Product>.Filter.Eq(p => p.Id, item.ProductoId),
                Builders<Product>.Filter.Eq(p => p.EmpresaId, empresaId)
            );

            var product = await _context.Products.Find(productFilter).FirstOrDefaultAsync();
            if (product == null)
            {
                return BadRequest(new { message = $"El producto '{item.NombreProducto}' no existe." });
            }

            // Verifico que haya suficiente stock antes de confirmar la venta
            if (product.Stock < item.Cantidad)
            {
                return BadRequest(new { message = $"Stock insuficiente para '{product.Nombre}'. Stock actual: {product.Stock}." });
            }

            // Calculo el stock que quedara despues de esta venta
            var previousStock = product.Stock;
            var newStock = previousStock - item.Cantidad;

            // Actualizo el stock del producto en la base de datos
            var stockUpdate = Builders<Product>.Update.Set(p => p.Stock, newStock);
            await _context.Products.UpdateOneAsync(productFilter, stockUpdate);

            // Registro la transaccion en el historial de movimientos de inventario
            var movement = new StockMovement
            {
                EmpresaId = empresaId,
                ProductoId = product.Id,
                NombreProducto = product.Nombre,
                Tipo = "Venta",
                Cantidad = item.Cantidad,
                StockAnterior = previousStock,
                StockNuevo = newStock,
                Motivo = $"Venta registrada ({sale.TipoComprobante})",
                CreadoPor = _userContext.UserId ?? string.Empty,
                CreadoPorNombre = nameClaim,
                FechaCreacion = DateTime.UtcNow
            };
            await _context.StockMovements.InsertOneAsync(movement);

            // Sumo el total de este item al total general de la venta
            computedTotal += item.Total;
        }

        // Generar correlativo atómico garantizado sin duplicados ni condiciones de carrera
        var seriesFilter = Builders<VoucherSeries>.Filter.And(
            Builders<VoucherSeries>.Filter.Eq(s => s.EmpresaId, empresaId),
            Builders<VoucherSeries>.Filter.Eq(s => s.TipoComprobante, sale.TipoComprobante),
            Builders<VoucherSeries>.Filter.Eq(s => s.Serie, sale.Serie)
        );

        var seriesUpdate = Builders<VoucherSeries>.Update
            .Inc(s => s.UltimoNumero, 1)
            .Set(s => s.FechaActualizacion, DateTime.UtcNow)
            .SetOnInsert(s => s.EmpresaId, empresaId)
            .SetOnInsert(s => s.TipoComprobante, sale.TipoComprobante)
            .SetOnInsert(s => s.CodigoSunat, sale.CodigoTipoComprobanteSunat)
            .SetOnInsert(s => s.Serie, sale.Serie)
            .SetOnInsert(s => s.Activa, true);

        var seriesOptions = new FindOneAndUpdateOptions<VoucherSeries>
        {
            IsUpsert = true,
            ReturnDocument = ReturnDocument.After
        };

        var updatedSeries = await _context.VoucherSeries.FindOneAndUpdateAsync(seriesFilter, seriesUpdate, seriesOptions);
        sale.NumeroCorrelativo = updatedSeries.UltimoNumero;
        sale.NumeroComprobante = $"{sale.Serie}-{sale.NumeroCorrelativo:D8}";

        // Calculo el total, subtotal e impuesto desde el servidor con estándar de IGV 18% (Perú)
        sale.Total = computedTotal;
        sale.Subtotal = Math.Round(computedTotal / 1.18m, 2);
        sale.Impuesto = Math.Round(computedTotal - sale.Subtotal, 2);
        sale.OperacionGravada = sale.Subtotal;
        sale.MontoIgv = sale.Impuesto;
        sale.PorcentajeIgv = 18m;

        // Estado inicial para integración con Facturación Electrónica (SUNAT)
        sale.SunatEstado = sale.TipoComprobante == "Nota de Venta" ? "No Aplica" : "No Enviado";

        if (sale.EstadoPago == "Fiado")
        {
            sale.FueFiado = true;
            sale.MetodoPago = "Ninguno (Pendiente)";
        }

        await _context.Sales.InsertOneAsync(sale);
        return CreatedAtAction(nameof(GetAll), new { id = sale.Id }, sale);
    }

    // GET api/sales/online-orders — lista los pedidos online de la empresa (para el panel admin)
    [HttpGet("online-orders")]
    public async Task<IActionResult> GetOnlineOrders([FromQuery] string? estado = null)
    {
        if (!_userContext.HasPermission("pedidos_web"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Solo pedidos donde EstadoOrden NO es null (son pedidos web)
        var filter = Builders<Sale>.Filter.And(
            Builders<Sale>.Filter.Eq(s => s.EmpresaId, empresaId),
            Builders<Sale>.Filter.Ne(s => s.EstadoOrden, (string?)null)
        );

        if (!string.IsNullOrEmpty(estado))
        {
            filter = Builders<Sale>.Filter.And(filter,
                Builders<Sale>.Filter.Eq(s => s.EstadoOrden, estado));
        }

        var orders = await _context.Sales.Find(filter)
            .SortByDescending(s => s.FechaCreacion)
            .ToListAsync();

        return Ok(orders);
    }

    // GET api/sales/online-orders/pending-count — cuenta los pedidos web con estado PENDIENTE_PAGO
    [HttpGet("online-orders/pending-count")]
    public async Task<IActionResult> GetPendingOnlineOrdersCount()
    {
        if (!_userContext.HasPermission("pedidos_web"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<Sale>.Filter.And(
            Builders<Sale>.Filter.Eq(s => s.EmpresaId, empresaId),
            Builders<Sale>.Filter.Eq(s => s.EstadoOrden, "PENDIENTE_PAGO")
        );

        var count = await _context.Sales.CountDocumentsAsync(filter);
        return Ok(new { count });
    }

    // PUT api/sales/{id}/order-status — actualiza el estado de ciclo de vida de un pedido online
    [HttpPut("{id}/order-status")]
    public async Task<IActionResult> UpdateOrderStatus(string id, [FromBody] UpdateOrderStatusRequest request)
    {
        if (!_userContext.HasPermission("pedidos_web"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var sale = await _context.Sales.Find(s => s.Id == id && s.EmpresaId == empresaId).FirstOrDefaultAsync();
        if (sale == null) return NotFound(new { message = "Pedido no encontrado." });

        if (string.IsNullOrEmpty(sale.EstadoOrden))
            return BadRequest(new { message = "Este registro no es un pedido online." });

        if (sale.EstadoOrden == "CANCELADO" || sale.EstadoOrden == "ENTREGADO")
            return BadRequest(new { message = $"No se puede cambiar el estado de un pedido {sale.EstadoOrden}." });

        var estadosValidos = new[] { "PENDIENTE_PAGO", "EN_PREPARACION", "ENVIADO", "ENTREGADO", "CANCELADO" };
        if (!estadosValidos.Contains(request.NuevoEstado))
            return BadRequest(new { message = "Estado no válido." });

        var nameClaim = User.FindFirst("name")?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value
            ?? "Administrador";

        var update = Builders<Sale>.Update
            .Set(s => s.EstadoOrden, request.NuevoEstado);

        // Al confirmar pago: el pedido entra en la contabilidad
        if (request.NuevoEstado == "EN_PREPARACION")
        {
            update = update
                .Set(s => s.EstadoPago, "Pagado")
                .Set(s => s.FechaConfirmacionPago, DateTime.UtcNow);
        }

        // Al enviar: guardar número de seguimiento si se proporcionó
        if (request.NuevoEstado == "ENVIADO" && !string.IsNullOrEmpty(request.NumeroSeguimiento))
        {
            update = update.Set(s => s.NumeroSeguimiento, request.NumeroSeguimiento);
        }

        // Descontar stock al confirmar pedido (transición de PENDIENTE_PAGO a EN_PREPARACION o ENVIADO/ENTREGADO)
        if (sale.EstadoOrden == "PENDIENTE_PAGO" && request.NuevoEstado != "PENDIENTE_PAGO" && request.NuevoEstado != "CANCELADO")
        {
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
                        Motivo = $"Pedido online confirmado (ID: {sale.Id})",
                        CreadoPor = _userContext.UserId ?? string.Empty,
                        CreadoPorNombre = nameClaim,
                        FechaCreacion = DateTime.UtcNow
                    };
                    await _context.StockMovements.InsertOneAsync(movement);
                }
            }
        }

        // Al cancelar: restaurar el stock de cada producto SOLO SI ya había sido descontado
        if (request.NuevoEstado == "CANCELADO" && sale.EstadoOrden != "PENDIENTE_PAGO")
        {
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
                    var newStock = previousStock + item.Cantidad;
                    await _context.Products.UpdateOneAsync(productFilter,
                        Builders<Product>.Update.Set(p => p.Stock, newStock));

                    var movement = new StockMovement
                    {
                        EmpresaId = empresaId,
                        ProductoId = product.Id,
                        NombreProducto = product.Nombre,
                        Tipo = "Cancelación Pedido Web",
                        Cantidad = item.Cantidad,
                        StockAnterior = previousStock,
                        StockNuevo = newStock,
                        Motivo = $"Pedido online cancelado (ID: {sale.Id})",
                        CreadoPor = _userContext.UserId ?? string.Empty,
                        CreadoPorNombre = nameClaim,
                        FechaCreacion = DateTime.UtcNow
                    };
                    await _context.StockMovements.InsertOneAsync(movement);
                }
            }
        }

        await _context.Sales.UpdateOneAsync(s => s.Id == id && s.EmpresaId == empresaId, update);

        var updatedSale = await _context.Sales.Find(s => s.Id == id).FirstOrDefaultAsync();
        return Ok(new { message = $"Estado actualizado a {request.NuevoEstado}.", pedido = updatedSale });
    }
    // POST api/sales/{id}/revert — revierte una venta, devuelve el stock y guarda el movimiento
    [HttpPost("{id}/revert")]
    public async Task<IActionResult> Revert(string id)
    {
        // Validar los permisos del usuario actual
        if (!_userContext.HasPermission("ventas") && !_userContext.HasPermission("historial_ventas"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var sale = await _context.Sales.Find(s => s.Id == id && s.EmpresaId == empresaId).FirstOrDefaultAsync();
        if (sale == null)
            return NotFound(new { message = "La venta no existe." });

        if (sale.Revertida)
            return BadRequest(new { message = "Esta venta ya ha sido revertida." });

        // Marcar la venta como revertida
        sale.Revertida = true;
        sale.FechaReversion = DateTime.UtcNow;
        var nameClaim = User.FindFirst("name")?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value
            ?? "Empleado";
        sale.RevertidaPorNombre = nameClaim;

        // Actualizar la venta en la base de datos
        var saleUpdate = Builders<Sale>.Update
            .Set(s => s.Revertida, true)
            .Set(s => s.FechaReversion, sale.FechaReversion)
            .Set(s => s.RevertidaPorNombre, sale.RevertidaPorNombre);
        await _context.Sales.UpdateOneAsync(s => s.Id == id && s.EmpresaId == empresaId, saleUpdate);

        // Devolver el stock a cada producto involucrado
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
                var newStock = previousStock + item.Cantidad;

                // Actualizar stock
                var stockUpdate = Builders<Product>.Update.Set(p => p.Stock, newStock);
                await _context.Products.UpdateOneAsync(productFilter, stockUpdate);

                // Registrar movimiento de devolución de stock
                var movement = new StockMovement
                {
                    EmpresaId = empresaId,
                    ProductoId = product.Id,
                    NombreProducto = product.Nombre,
                    Tipo = "Reversión",
                    Cantidad = item.Cantidad,
                    StockAnterior = previousStock,
                    StockNuevo = newStock,
                    Motivo = $"Venta revertida (ID: {sale.Id})",
                    CreadoPor = _userContext.UserId ?? string.Empty,
                    CreadoPorNombre = nameClaim,
                    FechaCreacion = DateTime.UtcNow
                };
                await _context.StockMovements.InsertOneAsync(movement);
            }
        }

        return Ok(new { message = "Venta revertida exitosamente y stock restaurado.", sale });
    }
}

// DTO para actualizar el estado de un pedido online
public class UpdateOrderStatusRequest
{
    public string NuevoEstado { get; set; } = string.Empty;
    public string? NumeroSeguimiento { get; set; }
}
