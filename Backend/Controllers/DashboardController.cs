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

// Controlador del dashboard: calcula y devuelve todos los indicadores y graficas del panel principal
// Ruta disponible en: api/dashboard
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    // Constructor: inyecta la BD y el contexto del usuario logueado
    public DashboardController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    // GET api/dashboard — devuelve un resumen completo con KPIs, graficas y alertas para el panel
    [HttpGet]
    public async Task<IActionResult> GetSummary([FromQuery] string? fecha = null)
    {
        if (!_userContext.HasPermission("dashboard"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Obtener la cantidad total de productos registrados en el inventario
        var totalProductos = await _context.Products.CountDocumentsAsync(p => p.EmpresaId == empresaId);

        // Listar productos con stock por debajo del minimo para mostrar alertas en el dashboard
        var products = await _context.Products.Find(p => p.EmpresaId == empresaId).ToListAsync();
        var productosBajoStock = products.Where(p => p.Stock <= p.StockMinimo).Select(p => new
        {
            p.Id,
            Nombre = p.Nombre,
            Stock = p.Stock,
            StockMinimo = p.StockMinimo
        }).ToList();

        // Calcular fecha objetivo para las ventas del dia
        DateTime targetDate = string.IsNullOrEmpty(fecha) ? DateTime.Today : DateTime.ParseExact(fecha, "yyyy-MM-dd", null);

        // Calcular el total de ingresos y la cantidad de ventas realizadas (filtrado por el dia objetivo)
        var sales = await _context.Sales.Find(s => s.EmpresaId == empresaId).ToListAsync();
        var todaySales = sales.Where(s => s.FechaCreacion.ToLocalTime().Date == targetDate.Date).ToList();
        var totalIngresos = todaySales.Sum(s => (double)s.Total);
        var totalVentasCount = todaySales.Count;

        // Calcular el total gastado en compras (solo si el usuario tiene permiso para verlo)
        double totalGastosCompras = 0;
        if (_userContext.HasPermission("compras"))
        {
            var purchases = await _context.Purchases.Find(p => p.EmpresaId == empresaId).ToListAsync();
            totalGastosCompras = purchases.Sum(p => (double)p.Total);
        }

        // Cargar los 5 movimientos de inventario mas recientes para la seccion de actividad reciente
        var recentMovements = await _context.StockMovements.Find(m => m.EmpresaId == empresaId)
            .SortByDescending(m => m.FechaCreacion)
            .Limit(5)
            .ToListAsync();

        // Agrupar las ventas por mes para la grafica de ventas mensuales
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

        // Agrupar las ventas por metodo de pago para la grafica de torta
        var metodosPago = sales
            .GroupBy(s => s.MetodoPago ?? "Efectivo")
            .Select(g => new
            {
                Metodo = g.Key,
                Total = g.Sum(s => (double)s.Total)
            })
            .ToList();

        // Calcular los 5 productos mas vendidos por cantidad de unidades
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

        // Distribuir las ventas del dia actual por hora (de 6am a 11pm) para la grafica horaria

        var ventasHorarias = Enumerable.Range(6, 17) // Distribucion horaria para el reporte diario (6am - 10pm)
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

        // Agrupar las ventas del dia actual por metodo de pago para la grafica de torta diaria
        var metodosPagoDia = todaySales
            .GroupBy(s => s.MetodoPago ?? "Efectivo")
            .Select(g => new
            {
                Metodo = g.Key,
                Total = g.Sum(s => (double)s.Total)
            })
            .ToList();

        // Calcular los 5 productos mas vendidos por cantidad de unidades en el dia actual
        var productosMasVendidosDia = todaySales
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

        // Retorno todos los datos agrupados para que el frontend los consuma en las distintas graficas
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
            MetodosPagoDia = metodosPagoDia,
            ProductosMasVendidos = productosMasVendidos,
            ProductosMasVendidosDia = productosMasVendidosDia,
            VentasHorarias = ventasHorarias,
            FechaDiaActual = targetDate.ToString("yyyy-MM-dd")
        });
    }

    // GET api/dashboard/history — devuelve datos agrupados por periodo (semanal, mensual, anual)
    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] string period = "mensual")
    {
        if (!_userContext.HasPermission("historial_negocio"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var sales = await _context.Sales.Find(s => s.EmpresaId == empresaId).ToListAsync();

        DateTime limitDate;
        var nowLocal = DateTime.Today; // local time base
        object ventasPeriodo;
        double totalIngresos = 0;
        List<Sale> filteredSales;

        if (period == "semanal")
        {
            // Ventas de los últimos 7 días
            limitDate = nowLocal.AddDays(-6);
            filteredSales = sales.Where(s => s.FechaCreacion.ToLocalTime().Date >= limitDate).ToList();
            totalIngresos = filteredSales.Sum(s => (double)s.Total);

            var dias = Enumerable.Range(0, 7)
                .Select(i => limitDate.AddDays(i))
                .ToList();

            ventasPeriodo = dias.Select(d => new
            {
                Etiqueta = d.ToString("dd-MMM"),
                DiaSemana = d.ToString("ddd"),
                Total = filteredSales.Where(s => s.FechaCreacion.ToLocalTime().Date == d.Date).Sum(s => (double)s.Total),
                Cantidad = filteredSales.Count(s => s.FechaCreacion.ToLocalTime().Date == d.Date)
            }).ToList();
        }
        else if (period == "anual")
        {
            // Ventas del año actual
            filteredSales = sales.Where(s => s.FechaCreacion.ToLocalTime().Year == nowLocal.Year).ToList();
            totalIngresos = filteredSales.Sum(s => (double)s.Total);

            ventasPeriodo = Enumerable.Range(1, 12)
                .Select(m => {
                    var monthSales = filteredSales.Where(s => s.FechaCreacion.ToLocalTime().Month == m).ToList();
                    return new
                    {
                        Etiqueta = new DateTime(nowLocal.Year, m, 1).ToString("MMM"),
                        MesNum = m,
                        Total = monthSales.Sum(s => (double)s.Total),
                        Cantidad = monthSales.Count()
                    };
                }).ToList();
        }
        else // mensual
        {
            // Ventas de los últimos 30 días
            limitDate = nowLocal.AddDays(-29);
            filteredSales = sales.Where(s => s.FechaCreacion.ToLocalTime().Date >= limitDate).ToList();
            totalIngresos = filteredSales.Sum(s => (double)s.Total);

            var dias = Enumerable.Range(0, 30)
                .Select(i => limitDate.AddDays(i))
                .ToList();

            ventasPeriodo = dias.Select(d => new
            {
                Etiqueta = d.ToString("dd-MMM"),
                Total = filteredSales.Where(s => s.FechaCreacion.ToLocalTime().Date == d.Date).Sum(s => (double)s.Total),
                Cantidad = filteredSales.Count(s => s.FechaCreacion.ToLocalTime().Date == d.Date)
            }).ToList();
        }

        // Métodos de pago en este periodo
        var metodosPago = filteredSales
            .GroupBy(s => s.MetodoPago ?? "Efectivo")
            .Select(g => new
            {
                Metodo = g.Key,
                Total = g.Sum(s => (double)s.Total)
            })
            .ToList();

        // Productos más vendidos en este periodo
        var productosMasVendidos = filteredSales
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

        return Ok(new
        {
            Period = period,
            TotalIngresos = totalIngresos,
            VentasPeriodo = ventasPeriodo,
            MetodosPago = metodosPago,
            ProductosMasVendidos = productosMasVendidos
        });
    }
}
