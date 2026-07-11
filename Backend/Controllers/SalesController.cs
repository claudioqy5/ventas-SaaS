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

        // Ordeno las ventas de la mas reciente a la mas antigua, excluyendo los fiados no pagados
        var sales = await _context.Sales.Find(s => s.EmpresaId == empresaId && s.EstadoPago != "Fiado")
            .SortByDescending(s => s.FechaCreacion)
            .ToListAsync();

        return Ok(sales);
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
                Motivo = $"Venta registrada",
                CreadoPor = _userContext.UserId ?? string.Empty,
                CreadoPorNombre = nameClaim,
                FechaCreacion = DateTime.UtcNow
            };
            await _context.StockMovements.InsertOneAsync(movement);

            // Sumo el total de este item al total general de la venta
            computedTotal += item.Total;
        }

        // Calculo el total, subtotal e impuesto desde el servidor (no confiamos en el valor del frontend)
        sale.Total = computedTotal;
        sale.Subtotal = computedTotal / 1.19m; // Calculo considerando el porcentaje de impuesto estandar
        sale.Impuesto = computedTotal - sale.Subtotal;

        if (sale.EstadoPago == "Fiado")
        {
            sale.FueFiado = true;
            sale.MetodoPago = "Ninguno (Pendiente)";
        }

        await _context.Sales.InsertOneAsync(sale);
        return CreatedAtAction(nameof(GetAll), new { id = sale.Id }, sale);
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
