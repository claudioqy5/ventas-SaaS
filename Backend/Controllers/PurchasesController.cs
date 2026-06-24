using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;

namespace SaaS.API.Controllers;

// Controlador de compras: registra las entradas de mercaderia al almacen y actualiza el stock
// Rutas disponibles bajo: api/purchases
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PurchasesController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    // Constructor: recibe la BD y el contexto del usuario logueado
    public PurchasesController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    // GET api/purchases — devuelve el historial de compras de la empresa, del mas reciente al mas antiguo
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (!_userContext.HasPermission("compras"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Traigo las compras ordenadas de la mas reciente a la mas antigua
        var purchases = await _context.Purchases.Find(p => p.EmpresaId == empresaId)
            .SortByDescending(p => p.FechaCreacion)
            .ToListAsync();

        return Ok(purchases);
    }

    // POST api/purchases — registra una compra nueva y actualiza el inventario de cada producto incluido
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Purchase purchase)
    {
        if (!_userContext.HasPermission("compras"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Preparo los datos de la compra antes de guardarla
        purchase.Id = string.Empty;
        purchase.EmpresaId = empresaId;
        purchase.CreadoPor = _userContext.UserId ?? string.Empty;

        // Obtengo el nombre del usuario desde el token JWT para dejarlo registrado en la compra
        var nameClaim = User.FindFirst("name")?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value
            ?? "Empleado";
        purchase.CreadoPorNombre = nameClaim;
        purchase.FechaCreacion = DateTime.UtcNow;

        decimal computedTotal = 0;

        // Recorro cada producto del detalle de la compra para actualizar el inventario
        foreach (var item in purchase.Detalles)
        {
            // Busco el producto en la BD para verificar que existe
            var productFilter = Builders<Product>.Filter.And(
                Builders<Product>.Filter.Eq(p => p.Id, item.ProductoId),
                Builders<Product>.Filter.Eq(p => p.EmpresaId, empresaId)
            );

            var product = await _context.Products.Find(productFilter).FirstOrDefaultAsync();
            if (product == null)
            {
                return BadRequest(new { message = $"El producto '{item.NombreProducto}' no existe." });
            }

            // Calculo el nuevo stock sumando la cantidad comprada al stock actual
            var previousStock = product.Stock;
            var newStock = previousStock + item.Cantidad;

            // Actualizo el stock y tambien el precio de costo con el valor de esta compra
            var stockUpdate = Builders<Product>.Update
                .Set(p => p.Stock, newStock)
                .Set(p => p.PrecioCosto, item.PrecioCosto);

            await _context.Products.UpdateOneAsync(productFilter, stockUpdate);

            // Dejo registrado el movimiento de inventario para que quede en el historial
            var movement = new StockMovement
            {
                EmpresaId = empresaId,
                ProductoId = product.Id,
                NombreProducto = product.Nombre,
                Tipo = "Compra",
                Cantidad = item.Cantidad,
                StockAnterior = previousStock,
                StockNuevo = newStock,
                Motivo = "Abastecimiento por Compra",
                CreadoPor = _userContext.UserId ?? string.Empty,
                CreadoPorNombre = nameClaim,
                FechaCreacion = DateTime.UtcNow
            };
            await _context.StockMovements.InsertOneAsync(movement);

            // Acumulo el total de la compra sumando el subtotal de cada item
            computedTotal += item.Total;
        }

        // Asigno el total calculado del servidor (no el que vino del frontend) para mayor seguridad
        purchase.Total = computedTotal;

        await _context.Purchases.InsertOneAsync(purchase);
        return CreatedAtAction(nameof(GetAll), new { id = purchase.Id }, purchase);
    }
}
