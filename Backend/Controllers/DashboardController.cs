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

        // Calcular el total de ingresos y la cantidad de ventas realizadas (filtrado por el dia objetivo, excluyendo fiados y ventas revertidas)
        var sales = await _context.Sales.Find(s => s.EmpresaId == empresaId && s.EstadoPago != "Fiado" && s.Revertida != true).ToListAsync();
        var todaySales = sales.Where(s => s.FechaCreacion.AddHours(-5).Date == targetDate.Date).ToList();
        var totalIngresos = todaySales.Sum(s => (double)s.Total);
        var totalNetoDia = todaySales.Sum(s => (double)s.Subtotal);
        var totalVentasCount = todaySales.Count;

        // Mapear costos de productos para calcular la ganancia bruta
        var productCostMap = products.ToDictionary(p => p.Id, p => p.PrecioCosto);
        double totalCostoHoy = 0;
        foreach (var s in todaySales)
        {
            foreach (var item in s.Detalles)
            {
                if (productCostMap.TryGetValue(item.ProductoId, out var costPrice))
                {
                    totalCostoHoy += (double)(item.Cantidad * costPrice);
                }
            }
        }
        double gananciaBrutaHoy = totalIngresos - totalCostoHoy;

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
                    .Where(s => s.FechaCreacion.AddHours(-5).Hour == h)
                    .Sum(s => (double)s.Total),
                Cantidad = todaySales
                    .Count(s => s.FechaCreacion.AddHours(-5).Hour == h)
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
            TotalNetoDia = totalNetoDia,
            GananciaBruta = gananciaBrutaHoy,
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

    // GET api/dashboard/history — devuelve datos agrupados por periodo (semanal, mensual, anual) con soporte para filtrar fecha
    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] string period = "mensual", [FromQuery] string? fecha = null)
    {
        if (!_userContext.HasPermission("historial_negocio"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var sales = await _context.Sales.Find(s => s.EmpresaId == empresaId && s.EstadoPago != "Fiado" && s.Revertida != true).ToListAsync();

        DateTime targetDate = string.IsNullOrEmpty(fecha) ? DateTime.Today : DateTime.ParseExact(fecha, "yyyy-MM-dd", null);

        object ventasPeriodo;
        List<Sale> filteredSales;
        string rangoTexto = "";

        if (period == "semanal")
        {
            // Calcular lunes y domingo de la semana de la fecha seleccionada
            int diff = (7 + (targetDate.DayOfWeek - DayOfWeek.Monday)) % 7;
            DateTime monday = targetDate.AddDays(-1 * diff).Date;
            DateTime sunday = monday.AddDays(6).Date;

            filteredSales = sales.Where(s => s.FechaCreacion.AddHours(-5).Date >= monday && s.FechaCreacion.AddHours(-5).Date <= sunday).ToList();
            rangoTexto = $"{monday:dd/MM/yyyy} al {sunday:dd/MM/yyyy}";

            var dias = Enumerable.Range(0, 7)
                .Select(i => monday.AddDays(i))
                .ToList();

            ventasPeriodo = dias.Select(d => new
            {
                Etiqueta = d.ToString("dd-MMM"),
                DiaSemana = d.ToString("dddd"),
                Total = filteredSales.Where(s => s.FechaCreacion.AddHours(-5).Date == d.Date).Sum(s => (double)s.Total),
                Cantidad = filteredSales.Count(s => s.FechaCreacion.AddHours(-5).Date == d.Date)
            }).ToList();
        }
        else if (period == "anual")
        {
            // Ventas del año de la fecha seleccionada
            filteredSales = sales.Where(s => s.FechaCreacion.AddHours(-5).Year == targetDate.Year).ToList();
            rangoTexto = $"Año {targetDate.Year}";

            ventasPeriodo = Enumerable.Range(1, 12)
                .Select(m => {
                    var monthSales = filteredSales.Where(s => s.FechaCreacion.AddHours(-5).Month == m).ToList();
                    return new
                    {
                        Etiqueta = new DateTime(targetDate.Year, m, 1).ToString("MMM"),
                        MesNum = m,
                        Total = monthSales.Sum(s => (double)s.Total),
                        Cantidad = monthSales.Count()
                    };
                }).ToList();
        }
        else // mensual
        {
            // Ventas del mes completo de la fecha seleccionada
            DateTime firstDayOfMonth = new DateTime(targetDate.Year, targetDate.Month, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            filteredSales = sales.Where(s => s.FechaCreacion.AddHours(-5).Date >= firstDayOfMonth && s.FechaCreacion.AddHours(-5).Date <= lastDayOfMonth).ToList();
            rangoTexto = targetDate.ToString("MMMM yyyy");

            int daysInMonth = DateTime.DaysInMonth(targetDate.Year, targetDate.Month);
            var dias = Enumerable.Range(0, daysInMonth)
                .Select(i => firstDayOfMonth.AddDays(i))
                .ToList();

            ventasPeriodo = dias.Select(d => new
            {
                Etiqueta = d.ToString("dd-MMM"),
                Total = filteredSales.Where(s => s.FechaCreacion.AddHours(-5).Date == d.Date).Sum(s => (double)s.Total),
                Cantidad = filteredSales.Count(s => s.FechaCreacion.AddHours(-5).Date == d.Date)
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

        double totalBruto = filteredSales.Sum(s => (double)s.Total);
        double totalNeto = filteredSales.Sum(s => (double)s.Subtotal);

        // Mapear costos de productos para calcular la ganancia bruta de este periodo
        var products = await _context.Products.Find(p => p.EmpresaId == empresaId).ToListAsync();
        var productCostMap = products.ToDictionary(p => p.Id, p => p.PrecioCosto);
        double totalCostoPeriodo = 0;
        foreach (var s in filteredSales)
        {
            foreach (var item in s.Detalles)
            {
                if (productCostMap.TryGetValue(item.ProductoId, out var costPrice))
                {
                    totalCostoPeriodo += (double)(item.Cantidad * costPrice);
                }
            }
        }
        double gananciaBrutaPeriodo = totalBruto - totalCostoPeriodo;

        return Ok(new
        {
            Period = period,
            TotalIngresos = totalBruto,
            TotalBruto = totalBruto,
            TotalNeto = totalNeto,
            GananciaBruta = gananciaBrutaPeriodo,
            RangoTexto = rangoTexto,
            VentasPeriodo = ventasPeriodo,
            MetodosPago = metodosPago,
            ProductosMasVendidos = productosMasVendidos
        });
    }
}
