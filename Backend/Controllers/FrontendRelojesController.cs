using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Data;
using SaaS.API.Models;

namespace SaaS.API.Controllers;

/// <summary>
/// API Exclusiva para el Frontend de Relojes.
/// Creada para no afectar ni alterar ninguna otra API del panel de administrador.
/// </summary>
[ApiController]
[Route("api/relojes-store")]
[AllowAnonymous]
public class FrontendRelojesController : ControllerBase
{
    private readonly MongoDbContext _context;

    public FrontendRelojesController(MongoDbContext context)
    {
        _context = context;
    }

    // GET api/relojes-store/{empresaId}
    [HttpGet("{empresaId}")]
    public async Task<IActionResult> GetTiendaInfo(string empresaId)
    {
        if (string.IsNullOrWhiteSpace(empresaId))
            return BadRequest(new { message = "Se requiere el ID de la empresa." });

        var empresa = await _context.Empresas.Find(e => e.Id == empresaId && e.Activo).FirstOrDefaultAsync();
        if (empresa == null)
            return NotFound(new { message = "Tienda inactiva o no encontrada." });

        return Ok(new
        {
            empresa.Id,
            empresa.Nombre
        });
    }

    // GET api/relojes-store/productos/{empresaId}
    [HttpGet("productos/{empresaId}")]
    public async Task<IActionResult> GetProductosRelojes(string empresaId)
    {
        if (string.IsNullOrWhiteSpace(empresaId))
            return BadRequest(new { message = "Se requiere el ID de la empresa." });

        var filter = Builders<Product>.Filter.Eq(p => p.EmpresaId, empresaId);
        var productos = await _context.Products.Find(filter).ToListAsync();

        var catFilter = Builders<Category>.Filter.Eq(c => c.EmpresaId, empresaId);
        var categorias = await _context.Categories.Find(catFilter).ToListAsync();
        var catDict = categorias.ToDictionary(c => c.Id, c => c.Nombre);

        // Mapeo 100% seguro: Filtramos cualquier dato interno como "PrecioCosto"
        var catalogo = productos.Select(p => new
        {
            p.Id,
            p.Nombre,
            p.Descripcion,
            p.Precio,
            p.PrecioOferta,
            p.Stock,
            CategoriaId = p.CategoriaId,
            Categoria = catDict.TryGetValue(p.CategoriaId ?? "", out var catName) ? catName : "Colección Destacada",
            p.ImagenUrl,
            p.Imagenes,
            p.CodigoBarras,
            p.TipoProducto
        });

        return Ok(catalogo);
    }
}
