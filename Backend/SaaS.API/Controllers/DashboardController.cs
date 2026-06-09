using System.Linq;
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
public class DashboardController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public DashboardController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetSummary()
    {
        if (!_userContext.HasPermission("dashboard"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Get total products count
        var totalProductos = await _context.Products.CountDocumentsAsync(p => p.EmpresaId == empresaId);

        // Get low stock list
        var products = await _context.Products.Find(p => p.EmpresaId == empresaId).ToListAsync();
        var productosBajoStock = products.Where(p => p.Stock <= p.StockMinimo).Select(p => new
        {
            p.Id,
            Nombre = p.Nombre,
            Stock = p.Stock,
            StockMinimo = p.StockMinimo
        }).ToList();

        // Calculate sales summaries
        var sales = await _context.Sales.Find(s => s.EmpresaId == empresaId).ToListAsync();
        var totalIngresos = sales.Sum(s => (double)s.Total);
        var totalVentasCount = sales.Count;

        // Calculate purchases summary (if permitted)
        double totalGastosCompras = 0;
        if (_userContext.HasPermission("compras"))
        {
            var purchases = await _context.Purchases.Find(p => p.EmpresaId == empresaId).ToListAsync();
            totalGastosCompras = purchases.Sum(p => (double)p.Total);
        }

        // Get 5 recent movements
        var recentMovements = await _context.StockMovements.Find(m => m.EmpresaId == empresaId)
            .SortByDescending(m => m.FechaCreacion)
            .Limit(5)
            .ToListAsync();

        return Ok(new
        {
            TotalProductos = totalProductos,
            TotalVentas = totalVentasCount,
            TotalIngresos = totalIngresos,
            TotalGastosCompras = totalGastosCompras,
            ProductosBajoStockCount = productosBajoStock.Count,
            ProductosBajoStock = productosBajoStock.Take(5),
            MovimientosRecientes = recentMovements.Select(m => new
            {
                m.Id,
                NombreProducto = m.NombreProducto,
                Tipo = m.Tipo,
                Cantidad = m.Cantidad,
                Motivo = m.Motivo,
                FechaCreacion = m.FechaCreacion
            })
        });
    }
}
