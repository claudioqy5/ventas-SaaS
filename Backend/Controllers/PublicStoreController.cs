using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Data;
using SaaS.API.Models;

namespace SaaS.API.Controllers;

/// <summary>
/// Controlador público para tiendas virtuales y catálogos de clientes.
/// No requiere autenticación (AllowAnonymous) y filtra de forma estricta por EmpresaId.
/// Por seguridad comercial, NUNCA expone PrecioCosto ni información de proveedores.
/// </summary>
[ApiController]
[Route("api/public/store")]
[AllowAnonymous]
public class PublicStoreController : ControllerBase
{
    private readonly MongoDbContext _context;

    public PublicStoreController(MongoDbContext context)
    {
        _context = context;
    }

    // GET api/public/store/{empresaId}
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
            empresa.Activo
        });
    }

    // GET api/public/store/{empresaId}/products
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
            filter = filterBuilder.And(filter, filterBuilder.Eq(p => p.CategoriaId, categoriaId));
        }

        var products = await _context.Products.Find(filter).ToListAsync();

        // Proyección pública segura: nunca expone PrecioCosto, PrecioCostoCostal ni datos internos
        var publicProducts = products.Select(p => new
        {
            p.Id,
            p.Nombre,
            p.Descripcion,
            p.CodigoBarras,
            p.CategoriaId,
            p.TipoProducto,
            p.UnidadMedida,
            p.EsServicio,
            p.Precio,
            p.PrecioCostal,
            p.KilosPorCostal,
            p.Stock,
            p.ImagenUrl
        });

        return Ok(publicProducts);
    }

    // GET api/public/store/{empresaId}/categories
    [HttpGet("{empresaId}/categories")]
    public async Task<IActionResult> GetStoreCategories(string empresaId)
    {
        if (string.IsNullOrWhiteSpace(empresaId))
            return BadRequest(new { message = "El identificador de la empresa es requerido." });

        var categories = await _context.Categories.Find(c => c.EmpresaId == empresaId).ToListAsync();
        return Ok(categories);
    }
}
