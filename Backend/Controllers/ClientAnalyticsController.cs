using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;

namespace SaaS.API.Controllers;

// ─────────────────────────────────────────────────────────────────────────────
// Controlador de Analítica de Clientes.
// Expone endpoints de solo lectura para estadísticas avanzadas de clientes.
// Rutas disponibles bajo: api/clientanalytics
// NO modifica ni toca los endpoints existentes de ClientsController.cs
// ─────────────────────────────────────────────────────────────────────────────
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClientAnalyticsController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    // Umbral en días para considerar que un cliente está "inactivo"
    private const int DiasInactividadUmbral = 30;

    public ClientAnalyticsController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET api/clientanalytics/top
    // Retorna el ranking de clientes ordenado por total gastado (descendente).
    // Para cada cliente incluye: top productos comprados, tendencia mensual
    // de los últimos 6 meses y los días que llevan sin comprar.
    // ─────────────────────────────────────────────────────────────────────────
    [HttpGet("top")]
    public async Task<IActionResult> GetTopClients()
    {
        if (!_userContext.HasPermission("clientes"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId))
            return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Cargar todas las ventas de la empresa que tengan cliente asignado y que no sean fiados pendientes
        var todasLasVentas = await _context.Sales
            .Find(s => s.EmpresaId == empresaId && s.ClienteId != null && s.EstadoPago != "Fiado")
            .ToListAsync();

        // Cargar la lista de clientes de la empresa para cruzar los datos
        var clientes = await _context.Clients
            .Find(c => c.EmpresaId == empresaId)
            .ToListAsync();

        // Referencia de tiempo actual en zona horaria Perú (UTC-5)
        var ahora = DateTime.UtcNow.AddHours(-5);
        var hace6Meses = ahora.AddMonths(-6);

        // Agrupar las ventas por clienteId para calcular las métricas
        var agrupado = todasLasVentas
            .GroupBy(s => s.ClienteId)
            .Select(g =>
            {
                var clienteId = g.Key!;
                var cliente = clientes.FirstOrDefault(c => c.Id == clienteId);
                if (cliente == null) return null;

                var ventasDelCliente = g.ToList();
                var ultimaCompraUtc = ventasDelCliente.Max(v => v.FechaCreacion);
                var ultimaCompraLocal = ultimaCompraUtc.AddHours(-5);
                var diasSinComprar = (int)(ahora - ultimaCompraLocal).TotalDays;

                // Top 5 productos más comprados por este cliente
                var topProductos = ventasDelCliente
                    .SelectMany(v => v.Detalles ?? new List<SaleItem>())
                    .GroupBy(d => d.NombreProducto)
                    .Select(pg => new
                    {
                        Producto = pg.Key,
                        Cantidad = pg.Sum(d => d.Cantidad),
                        TotalGastado = pg.Sum(d => (double)d.Total)
                    })
                    .OrderByDescending(p => p.Cantidad)
                    .Take(5)
                    .ToList();

                // Tendencia mensual de los últimos 6 meses
                var tendencia = Enumerable.Range(0, 6)
                    .Select(i =>
                    {
                        var mesRef = ahora.AddMonths(-5 + i);
                        var ventasMes = ventasDelCliente
                            .Where(v =>
                            {
                                var vLocal = v.FechaCreacion.AddHours(-5);
                                return vLocal.Year == mesRef.Year && vLocal.Month == mesRef.Month;
                            })
                            .ToList();
                        return new
                        {
                            Mes = mesRef.ToString("MMM"),
                            MesNum = mesRef.Month,
                            Anio = mesRef.Year,
                            Total = ventasMes.Sum(v => (double)v.Total),
                            Cantidad = ventasMes.Count
                        };
                    })
                    .ToList();

                return new
                {
                    ClienteId = clienteId,
                    Nombre = cliente.Nombre,
                    Telefono = cliente.Telefono,
                    Correo = cliente.Correo,
                    NumeroDocumento = cliente.NumeroDocumento,
                    TotalGastado = (double)ventasDelCliente.Sum(v => v.Total),
                    NumCompras = ventasDelCliente.Count,
                    UltimaCompra = ultimaCompraLocal.ToString("dd/MM/yyyy HH:mm"),
                    DiasDesdeUltimaCompra = diasSinComprar,
                    Inactivo = diasSinComprar >= DiasInactividadUmbral,
                    TopProductos = topProductos,
                    TendenciaMensual = tendencia
                };
            })
            .Where(x => x != null)
            .OrderByDescending(x => x!.TotalGastado)
            .ToList();

        return Ok(agrupado);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET api/clientanalytics/inventoryvalue
    // Calcula el valor total del inventario a precio de costo.
    // Retorna el valor total (costo × stock), cantidad de productos activos
    // y el producto individual de mayor valor en inventario.
    // ─────────────────────────────────────────────────────────────────────────
    [HttpGet("inventoryvalue")]
    public async Task<IActionResult> GetInventoryValue()
    {
        if (!_userContext.HasPermission("productos"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId))
            return BadRequest(new { message = "Falta el identificador de la empresa." });

        var productos = await _context.Products
            .Find(p => p.EmpresaId == empresaId)
            .ToListAsync();

        if (!productos.Any())
            return Ok(new { ValorTotal = 0, CantidadProductos = 0, ProductoMayorValor = (object?)null });

        // Valor total = suma de (precioCosto × stock) para todos los productos
        var valorTotal = productos.Sum(p => (double)p.PrecioCosto * p.Stock);

        // Producto cuyo valor en inventario es el mayor
        var productoMayorValor = productos
            .OrderByDescending(p => (double)p.PrecioCosto * p.Stock)
            .Select(p => new
            {
                Nombre = p.Nombre,
                Stock = p.Stock,
                PrecioCosto = (double)p.PrecioCosto,
                ValorEnInventario = (double)p.PrecioCosto * p.Stock
            })
            .FirstOrDefault();

        return Ok(new
        {
            ValorTotal = valorTotal,
            ValorPromedioPorProducto = productos.Count > 0 ? valorTotal / productos.Count : 0,
            CantidadProductos = productos.Count,
            ProductoMayorValor = productoMayorValor
        });
    }
}
