using System;
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
public class ProductsController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public ProductsController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (!_userContext.HasPermission("productos")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var products = await _context.Products.Find(p => p.EmpresaId == empresaId).ToListAsync();
        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Product product)
    {
        if (!_userContext.HasPermission("modificar_productos")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        product.Id = string.Empty;
        product.EmpresaId = empresaId;
        product.FechaCreacion = DateTime.UtcNow;

        await _context.Products.InsertOneAsync(product);

        // Track initial stock movement if there is initial stock
        if (product.Stock > 0)
        {
            var movement = new StockMovement
            {
                EmpresaId = empresaId,
                ProductoId = product.Id,
                NombreProducto = product.Nombre,
                Tipo = "Ajuste",
                Cantidad = product.Stock,
                StockAnterior = 0,
                StockNuevo = product.Stock,
                Motivo = "Carga inicial de inventario",
                CreadoPor = _userContext.UserId ?? string.Empty,
                CreadoPorNombre = _userContext.UserId ?? "Sistema",
                FechaCreacion = DateTime.UtcNow
            };
            await _context.StockMovements.InsertOneAsync(movement);
        }

        return CreatedAtAction(nameof(GetAll), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Product product)
    {
        if (!_userContext.HasPermission("modificar_productos")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<Product>.Filter.And(
            Builders<Product>.Filter.Eq(p => p.Id, id),
            Builders<Product>.Filter.Eq(p => p.EmpresaId, empresaId)
        );

        var update = Builders<Product>.Update
            .Set(p => p.Nombre, product.Nombre)
            .Set(p => p.Descripcion, product.Descripcion)
            .Set(p => p.CodigoBarras, product.CodigoBarras)
            .Set(p => p.CategoriaId, product.CategoriaId)
            .Set(p => p.Precio, product.Precio)
            .Set(p => p.PrecioCosto, product.PrecioCosto)
            .Set(p => p.StockMinimo, product.StockMinimo)
            .Set(p => p.ImagenUrl, product.ImagenUrl);

        var result = await _context.Products.UpdateOneAsync(filter, update);
        if (result.MatchedCount == 0) return NotFound();

        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!_userContext.HasPermission("modificar_productos")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<Product>.Filter.And(
            Builders<Product>.Filter.Eq(p => p.Id, id),
            Builders<Product>.Filter.Eq(p => p.EmpresaId, empresaId)
        );

        var result = await _context.Products.DeleteOneAsync(filter);
        if (result.DeletedCount == 0) return NotFound();

        return NoContent();
    }
}
