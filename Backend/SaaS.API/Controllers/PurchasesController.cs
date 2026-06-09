using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.Application.Interfaces;
using SaaS.Domain.Entities;
using SaaS.Infrastructure.Persistence;

namespace SaaS.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PurchasesController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public PurchasesController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (!_userContext.HasPermission("compras"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var purchases = await _context.Purchases.Find(p => p.EmpresaId == empresaId)
            .SortByDescending(p => p.FechaCreacion)
            .ToListAsync();

        return Ok(purchases);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Purchase purchase)
    {
        if (!_userContext.HasPermission("compras"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        purchase.Id = string.Empty;
        purchase.EmpresaId = empresaId;
        purchase.CreadoPor = _userContext.UserId ?? string.Empty;
        purchase.CreadoPorNombre = _userContext.UserId ?? "Empleado";
        purchase.FechaCreacion = DateTime.UtcNow;

        decimal computedTotal = 0;

        foreach (var item in purchase.Detalles)
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

            // Increase stock
            var previousStock = product.Stock;
            var newStock = previousStock + item.Cantidad;

            // Update cost price of product dynamically
            var stockUpdate = Builders<Product>.Update
                .Set(p => p.Stock, newStock)
                .Set(p => p.PrecioCosto, item.PrecioCosto);

            await _context.Products.UpdateOneAsync(productFilter, stockUpdate);

            // Log stock movement
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
                CreadoPorNombre = _userContext.UserId ?? "Empleado",
                FechaCreacion = DateTime.UtcNow
            };
            await _context.StockMovements.InsertOneAsync(movement);

            computedTotal += item.Total;
        }

        purchase.Total = computedTotal;

        await _context.Purchases.InsertOneAsync(purchase);
        return CreatedAtAction(nameof(GetAll), new { id = purchase.Id }, purchase);
    }
}
