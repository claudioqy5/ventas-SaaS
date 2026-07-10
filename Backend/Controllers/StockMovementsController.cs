using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;

namespace SaaS.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class StockMovementsController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public StockMovementsController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search = null, [FromQuery] string? startDate = null, [FromQuery] string? endDate = null)
    {
        if (!_userContext.HasPermission("movimientos"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) 
            return BadRequest(new { message = "Falta el identificador de la empresa." });

        var builder = Builders<StockMovement>.Filter;
        var filter = builder.Eq(m => m.EmpresaId, empresaId);

        // Filtro por búsqueda de texto en nombre de producto
        if (!string.IsNullOrEmpty(search))
        {
            filter &= builder.Regex(m => m.NombreProducto, new BsonRegularExpression(search, "i"));
        }

        // Filtro por rango de fechas
        if (!string.IsNullOrEmpty(startDate))
        {
            if (DateTime.TryParse(startDate, out var start))
            {
                start = start.Date; // 00:00:00 local
                filter &= builder.Gte(m => m.FechaCreacion, start.ToUniversalTime());
            }
        }

        if (!string.IsNullOrEmpty(endDate))
        {
            if (DateTime.TryParse(endDate, out var end))
            {
                end = end.Date.AddDays(1).AddTicks(-1); // 23:59:59 local
                filter &= builder.Lte(m => m.FechaCreacion, end.ToUniversalTime());
            }
        }

        var movements = await _context.StockMovements.Find(filter)
            .SortByDescending(m => m.FechaCreacion)
            .ToListAsync();

        return Ok(movements);
    }
}
