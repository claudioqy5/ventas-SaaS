using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;

namespace SaaS.API.Controllers;

// Controlador que gestiona el CRUD de clientes de cada tienda
// Todas las rutas empiezan con: api/clients
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    // Acceso a la base de datos y al usuario logueado
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    // Constructor: recibe la BD y el contexto del usuario via inyeccion de dependencias
    public ClientsController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    // GET api/clients — retorna la lista de todos los clientes de la empresa actual
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Verifico que el usuario tenga acceso al modulo de clientes
        if (!_userContext.HasPermission("clientes"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Traer solo los clientes de esta empresa (cada tienda ve solo sus propios clientes)
        var clients = await _context.Clients.Find(c => c.EmpresaId == empresaId).ToListAsync();
        return Ok(clients);
    }

    // POST api/clients — registra un nuevo cliente
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Client client)
    {
        if (!_userContext.HasPermission("clientes"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Limpio el Id para que MongoDB lo genere automaticamente
        client.Id = string.Empty;
        // Vinculo el cliente a la empresa actual
        client.EmpresaId = empresaId;
        // Registro la fecha exacta en que fue creado
        client.FechaCreacion = DateTime.UtcNow;

        await _context.Clients.InsertOneAsync(client);
        return CreatedAtAction(nameof(GetAll), new { id = client.Id }, client);
    }

    // PUT api/clients/{id} — actualiza los datos de un cliente existente
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Client client)
    {
        if (!_userContext.HasPermission("clientes"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Busco el cliente por su Id y confirmo que pertenece a esta empresa
        var filter = Builders<Client>.Filter.And(
            Builders<Client>.Filter.Eq(c => c.Id, id),
            Builders<Client>.Filter.Eq(c => c.EmpresaId, empresaId)
        );

        // Actualizo solo los campos editables del cliente
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

    // DELETE api/clients/{id} — elimina un cliente por su Id
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!_userContext.HasPermission("clientes"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Filtro doble para asegurar que solo se borre un cliente de esta tienda
        var filter = Builders<Client>.Filter.And(
            Builders<Client>.Filter.Eq(c => c.Id, id),
            Builders<Client>.Filter.Eq(c => c.EmpresaId, empresaId)
        );

        var result = await _context.Clients.DeleteOneAsync(filter);
        if (result.DeletedCount == 0) return NotFound();

        return NoContent();
    }
}
