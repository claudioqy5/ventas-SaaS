using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Models;
using SaaS.API.Data;
using SaaS.API.Services;

namespace SaaS.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CreditSalesController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public CreditSalesController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest();

        var pending = await _context.Sales
            .Find(s => s.EmpresaId == empresaId && s.EstadoPago == "Fiado" && s.Revertida != true)
            .SortByDescending(s => s.FechaCreacion)
            .ToListAsync();

        return Ok(pending);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest();

        var history = await _context.Sales
            .Find(s => s.EmpresaId == empresaId && s.FueFiado == true && s.EstadoPago == "Pagado" && s.Revertida != true)
            .SortByDescending(s => s.FechaPago)
            .ToListAsync();

        return Ok(history);
    }

    [HttpGet("metrics")]
    public async Task<IActionResult> GetMetrics()
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest();

        var allFiados = await _context.Sales
            .Find(s => s.EmpresaId == empresaId && (s.EstadoPago == "Fiado" || s.FueFiado == true) && s.Revertida != true)
            .ToListAsync();

        var totalPendiente = allFiados.Where(s => s.EstadoPago == "Fiado").Sum(s => s.Total);
        var totalRecuperado = allFiados.Where(s => s.EstadoPago == "Pagado").Sum(s => s.Total);
        var cantidadPendientes = allFiados.Count(s => s.EstadoPago == "Fiado");
        var cantidadRecuperados = allFiados.Count(s => s.EstadoPago == "Pagado");

        return Ok(new
        {
            TotalPendiente = totalPendiente,
            TotalRecuperado = totalRecuperado,
            CantidadPendientes = cantidadPendientes,
            CantidadRecuperados = cantidadRecuperados
        });
    }

    public class PayRequest
    {
        public string MetodoPago { get; set; } = string.Empty;
    }

    [HttpPost("{id}/pay")]
    public async Task<IActionResult> MarkAsPaid(string id, [FromBody] PayRequest request)
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest();

        var sale = await _context.Sales
            .Find(s => s.Id == id && s.EmpresaId == empresaId && s.EstadoPago == "Fiado")
            .FirstOrDefaultAsync();

        if (sale == null)
            return NotFound(new { message = "Venta a crédito no encontrada o ya pagada." });

        if (string.IsNullOrEmpty(request.MetodoPago))
            return BadRequest(new { message = "Debe especificar el método de pago." });

        var updateDef = Builders<Sale>.Update
            .Set(s => s.EstadoPago, "Pagado")
            .Set(s => s.MetodoPago, request.MetodoPago)
            .Set(s => s.FechaPago, DateTime.UtcNow);

        await _context.Sales.UpdateOneAsync(s => s.Id == id, updateDef);

        return Ok(new { message = "Fiado registrado como pagado exitosamente." });
    }
}
