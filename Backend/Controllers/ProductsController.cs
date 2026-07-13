using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;

namespace SaaS.API.Controllers;

// Controlador de productos: permite consultar, crear, editar y eliminar productos del inventario
// Rutas disponibles bajo: api/products
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    // Constructor: inyecta la BD y el usuario que realiza la peticion
    public ProductsController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    // GET api/products — devuelve todos los productos del inventario de esta tienda
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Para ver los productos basta con tener el permiso basico de "productos"
        if (!_userContext.HasPermission("productos")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Filtro por empresa para que cada tienda solo vea sus propios productos
        var products = await _context.Products.Find(p => p.EmpresaId == empresaId).ToListAsync();
        return Ok(products);
    }

    // POST api/products — crea un producto nuevo en el inventario
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Product product)
    {
        // Para crear o modificar productos se necesita el permiso especial "modificar_productos"
        if (!_userContext.HasPermission("modificar_productos")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Dejo el Id vacio para que MongoDB lo asigne automaticamente
        product.Id = string.Empty;
        product.EmpresaId = empresaId;
        product.FechaCreacion = DateTime.UtcNow;

        await _context.Products.InsertOneAsync(product);

        // Si el producto ya tiene stock inicial, registro ese ingreso en el historial de movimientos
        if (product.Stock > 0 && !product.EsServicio)
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

    // PUT api/products/{id} — actualiza los datos de un producto (NO modifica el stock desde aqui)
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Product product)
    {
        if (!_userContext.HasPermission("modificar_productos")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Busco el producto por Id y empresa para no modificar datos de otras tiendas
        var filter = Builders<Product>.Filter.And(
            Builders<Product>.Filter.Eq(p => p.Id, id),
            Builders<Product>.Filter.Eq(p => p.EmpresaId, empresaId)
        );

        // Actualizo todos los campos del producto incluyendo los nuevos campos de tipo y precio por costal
        var update = Builders<Product>.Update
            .Set(p => p.Nombre, product.Nombre)
            .Set(p => p.Descripcion, product.Descripcion)
            .Set(p => p.CodigoBarras, product.CodigoBarras)
            .Set(p => p.CategoriaId, product.CategoriaId)
            .Set(p => p.Precio, product.Precio)
            .Set(p => p.PrecioCosto, product.PrecioCosto)
            .Set(p => p.StockMinimo, product.StockMinimo)
            .Set(p => p.ImagenUrl, product.ImagenUrl)
            .Set(p => p.TipoProducto, product.TipoProducto)
            .Set(p => p.UnidadMedida, product.UnidadMedida)
            .Set(p => p.EsServicio, product.EsServicio)
            .Set(p => p.PrecioCostal, product.PrecioCostal)
            .Set(p => p.KilosPorCostal, product.KilosPorCostal);

        var result = await _context.Products.UpdateOneAsync(filter, update);
        if (result.MatchedCount == 0) return NotFound();

        return Ok(product);
    }

    // DELETE api/products/{id} — elimina un producto del inventario
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!_userContext.HasPermission("modificar_productos")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Filtro doble para no borrar un producto de otra empresa por accidente
        var filter = Builders<Product>.Filter.And(
            Builders<Product>.Filter.Eq(p => p.Id, id),
            Builders<Product>.Filter.Eq(p => p.EmpresaId, empresaId)
        );

        var result = await _context.Products.DeleteOneAsync(filter);
        if (result.DeletedCount == 0) return NotFound();

        return NoContent();
    }
}
