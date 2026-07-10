using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Models;
using SaaS.API.Data;
using SaaS.API.Services;

namespace SaaS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegisterRequestsController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public RegisterRequestsController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    // POST api/registerrequests — Envía una nueva solicitud de registro (Público)
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] RegisterRequest request)
    {
        if (request == null) return BadRequest(new { message = "Datos inválidos." });

        request.Id = string.Empty;
        request.Estado = "Pendiente";
        request.FechaCreacion = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(request.NombreEmpresa) ||
            string.IsNullOrWhiteSpace(request.NombrePropietario) ||
            string.IsNullOrWhiteSpace(request.CorreoPropietario) ||
            string.IsNullOrWhiteSpace(request.Telefono))
        {
            return BadRequest(new { message = "Todos los campos obligatorios deben ser rellenados." });
        }

        await _context.RegisterRequests.InsertOneAsync(request);
        return Ok(new { message = "Solicitud enviada correctamente." });
    }

    // GET api/registerrequests — Devuelve todas las solicitudes (Solo Superadmin)
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (_userContext.Role != "Superadmin") return Forbid();

        var requests = await _context.RegisterRequests
            .Find(_ => true)
            .SortByDescending(r => r.FechaCreacion)
            .ToListAsync();

        return Ok(requests);
    }

    // PUT api/registerrequests/{id}/status — Modifica el estado de una solicitud (Solo Superadmin)
    [Authorize]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusRequest body)
    {
        if (_userContext.Role != "Superadmin") return Forbid();

        var filter = Builders<RegisterRequest>.Filter.Eq(r => r.Id, id);
        var request = await _context.RegisterRequests.Find(filter).FirstOrDefaultAsync();
        if (request == null) return NotFound(new { message = "Solicitud no encontrada." });

        if (body == null || string.IsNullOrWhiteSpace(body.Estado))
            return BadRequest(new { message = "El estado es requerido." });

        var update = Builders<RegisterRequest>.Update.Set(r => r.Estado, body.Estado);
        await _context.RegisterRequests.UpdateOneAsync(filter, update);

        return Ok(new { message = $"El estado de la solicitud ha sido cambiado a {body.Estado}." });
    }
}

public record UpdateStatusRequest(string Estado);
