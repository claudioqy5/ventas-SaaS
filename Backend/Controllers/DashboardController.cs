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

        // Obtener la cantidad total de productos registrados
        var totalProductos = await _context.Products.CountDocumentsAsync(p => p.EmpresaId == empresaId);

        // Listar productos con niveles de inventario por debajo del minimo establecido
        var products = await _context.Products.Find(p => p.EmpresaId == empresaId).ToListAsync();
        var productosBajoStock = products.Where(p => p.Stock <= p.StockMinimo).Select(p => new
        {
            p.Id,
            Nombre = p.Nombre,
            Stock = p.Stock,
            StockMinimo = p.StockMinimo
        }).ToList();

        // Calcular los resumenes financieros de ventas
        var sales = await _context.Sales.Find(s => s.EmpresaId == empresaId).ToListAsync();
        var totalIngresos = sales.Sum(s => (double)s.Total);
        var totalVentasCount = sales.Count;

        // Calcular los costos acumulados de compras si el usuario tiene acceso
        double totalGastosCompras = 0;
        if (_userContext.HasPermission("compras"))
        {
            var purchases = await _context.Purchases.Find(p => p.EmpresaId == empresaId).ToListAsync();
            totalGastosCompras = purchases.Sum(p => (double)p.Total);
        }

        // Cargar los 5 movimientos de almacen mas recientes
        var recentMovements = await _context.StockMovements.Find(m => m.EmpresaId == empresaId)
            .SortByDescending(m => m.FechaCreacion)
            .Limit(5)
            .ToListAsync();

        // 1. Group sales by Month (e.g. "2026-06")
        var ventasMensuales = sales
            .GroupBy(s => s.FechaCreacion.ToString("yyyy-MM"))
            .Select(g => new
            {
                Mes = g.Key,
                Total = g.Sum(s => (double)s.Total),
                Cantidad = g.Count()
            })
            .OrderBy(x => x.Mes)
            .ToList();

        // 2. Group sales by Payment Method
        var metodosPago = sales
            .GroupBy(s => s.MetodoPago ?? "Efectivo")
            .Select(g => new
            {
                Metodo = g.Key,
                Total = g.Sum(s => (double)s.Total)
            })
            .ToList();

        // 3. Top selling products
        var productosMasVendidos = sales
            .SelectMany(s => s.Detalles)
            .GroupBy(d => d.NombreProducto)
            .Select(g => new
            {
                Producto = g.Key,
                Cantidad = g.Sum(d => d.Cantidad)
            })
            .OrderByDescending(x => x.Cantidad)
            .Take(5)
            .ToList();

        // 4. Daily sales trend (6:00 AM to 11:59 PM) for the latest active date of sales
        var latestSaleDate = sales.Any() ? sales.Max(s => s.FechaCreacion.ToLocalTime().Date) : DateTime.Today;
        var todaySales = sales
            .Where(s => s.FechaCreacion.ToLocalTime().Date == latestSaleDate)
            .ToList();

        var ventasHorarias = Enumerable.Range(6, 18) // Distribucion horaria para el reporte diario
            .Select(h => new
            {
                Hora = $"{h:00}:00",
                Total = todaySales
                    .Where(s => s.FechaCreacion.ToLocalTime().Hour == h)
                    .Sum(s => (double)s.Total),
                Cantidad = todaySales
                    .Count(s => s.FechaCreacion.ToLocalTime().Hour == h)
            })
            .ToList();

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
            }),
            VentasMensuales = ventasMensuales,
            MetodosPago = metodosPago,
            ProductosMasVendidos = productosMasVendidos,
            VentasHorarias = ventasHorarias,
            FechaDiaActual = latestSaleDate.ToString("dd/MM/yyyy")
        });
    }
}
