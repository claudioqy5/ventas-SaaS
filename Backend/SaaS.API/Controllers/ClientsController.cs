using System;
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
public class ClientsController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public ClientsController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (!_userContext.HasPermission("clientes"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var clients = await _context.Clients.Find(c => c.EmpresaId == empresaId).ToListAsync();
        return Ok(clients);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Client client)
    {
        if (!_userContext.HasPermission("clientes"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        client.Id = string.Empty;
        client.EmpresaId = empresaId;
        client.FechaCreacion = DateTime.UtcNow;

        await _context.Clients.InsertOneAsync(client);
        return CreatedAtAction(nameof(GetAll), new { id = client.Id }, client);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Client client)
    {
        if (!_userContext.HasPermission("clientes"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<Client>.Filter.And(
            Builders<Client>.Filter.Eq(c => c.Id, id),
            Builders<Client>.Filter.Eq(c => c.EmpresaId, empresaId)
        );

        var update = Builders<Client>.Update
            .Set(c => c.Nombre, client.Nombre)
            .Set(c => c.Telefono, client.Telefono)
            .Set(c => c.Correo, client.Correo)
            .Set(c => c.NumeroDocumento, client.NumeroDocumento)
            .Set(c => c.Direccion, client.Direccion);

        var result = await _context.Clients.UpdateOneAsync(filter, update);
        if (result.MatchedCount == 0) return NotFound();

        return Ok(client);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!_userContext.HasPermission("clientes"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<Client>.Filter.And(
            Builders<Client>.Filter.Eq(c => c.Id, id),
            Builders<Client>.Filter.Eq(c => c.EmpresaId, empresaId)
        );

        var result = await _context.Clients.DeleteOneAsync(filter);
        if (result.DeletedCount == 0) return NotFound();

        return NoContent();
    }
}
