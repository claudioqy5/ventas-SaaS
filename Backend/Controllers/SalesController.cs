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

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public SalesController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Validar los permisos del usuario actual
        if (!_userContext.HasPermission("historial_ventas"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var sales = await _context.Sales.Find(s => s.EmpresaId == empresaId)
            .SortByDescending(s => s.FechaCreacion)
            .ToListAsync();

        return Ok(sales);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Sale sale)
    {
        // Confirmar si el usuario tiene habilitado el modulo de ventas
        if (!_userContext.HasPermission("ventas"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        sale.Id = string.Empty;
        sale.EmpresaId = empresaId;
        sale.CreadoPor = _userContext.UserId ?? string.Empty;
        
        var nameClaim = User.FindFirst("name")?.Value 
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value 
            ?? "Empleado";
        sale.CreadoPorNombre = nameClaim;
        sale.FechaCreacion = DateTime.UtcNow;

        decimal computedTotal = 0;

        // Procesar la disminucion del stock de los productos vendidos
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

            if (product.Stock < item.Cantidad)
            {
                return BadRequest(new { message = $"Stock insuficiente para '{product.Nombre}'. Stock actual: {product.Stock}." });
            }

            // Restar cantidad del almacen
            var previousStock = product.Stock;
            var newStock = previousStock - item.Cantidad;

            var stockUpdate = Builders<Product>.Update.Set(p => p.Stock, newStock);
            await _context.Products.UpdateOneAsync(productFilter, stockUpdate);

            // Registrar la transaccion en el historial de movimientos de inventario
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

            computedTotal += item.Total;
        }

        sale.Total = computedTotal;
        sale.Subtotal = computedTotal / 1.19m; // Calculo considerando el porcentaje de impuesto estandar
        sale.Impuesto = computedTotal - sale.Subtotal;

        await _context.Sales.InsertOneAsync(sale);
        return CreatedAtAction(nameof(GetAll), new { id = sale.Id }, sale);
    }
}
