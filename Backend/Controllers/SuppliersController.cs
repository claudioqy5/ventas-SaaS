using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;

namespace SaaS.API.Controllers;

// Controlador para gestionar los proveedores de cada tienda
// Rutas disponibles bajo: api/suppliers
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SuppliersController : ControllerBase
{
    // Acceso a la base de datos y al contexto del usuario logueado
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    // Constructor: inyecta la BD y el servicio de usuario actual
    public SuppliersController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    // GET api/suppliers — lista todos los proveedores de la empresa actual
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Solo usuarios con permiso de proveedores pueden acceder
        if (!_userContext.HasPermission("proveedores"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Traigo solo los proveedores de esta empresa
        var suppliers = await _context.Suppliers.Find(s => s.EmpresaId == empresaId).ToListAsync();
        return Ok(suppliers);
    }

    // POST api/suppliers — registra un proveedor nuevo
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Supplier supplier)
    {
        if (!_userContext.HasPermission("proveedores"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // MongoDB genera el Id automaticamente si lo dejo vacio
        supplier.Id = string.Empty;
        // Vinculo el proveedor a la empresa del usuario logueado
        supplier.EmpresaId = empresaId;
        // Registra la fecha actual como fecha de creacion
        supplier.FechaCreacion = DateTime.UtcNow;

        await _context.Suppliers.InsertOneAsync(supplier);
        return CreatedAtAction(nameof(GetAll), new { id = supplier.Id }, supplier);
    }

    // PUT api/suppliers/{id} — edita un proveedor existente
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Supplier supplier)
    {
        if (!_userContext.HasPermission("proveedores"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Busco el proveedor por Id y empresa para no tocar datos de otra tienda
        var filter = Builders<Supplier>.Filter.And(
            Builders<Supplier>.Filter.Eq(s => s.Id, id),
            Builders<Supplier>.Filter.Eq(s => s.EmpresaId, empresaId)
        );

        // Solo actualizo los campos de contacto del proveedor
        var update = Builders<Supplier>.Update
            .Set(s => s.Nombre, supplier.Nombre)
            .Set(s => s.Telefono, supplier.Telefono)
            .Set(s => s.Correo, supplier.Correo)
            .Set(s => s.Direccion, supplier.Direccion);

        var result = await _context.Suppliers.UpdateOneAsync(filter, update);
        if (result.MatchedCount == 0) return NotFound();

        return Ok(supplier);
    }

    // DELETE api/suppliers/{id} — elimina un proveedor por su Id
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!_userContext.HasPermission("proveedores"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Filtro doble: Id + empresaId para garantizar que solo se borra el proveedor correcto
        var filter = Builders<Supplier>.Filter.And(
            Builders<Supplier>.Filter.Eq(s => s.Id, id),
            Builders<Supplier>.Filter.Eq(s => s.EmpresaId, empresaId)
        );

        var result = await _context.Suppliers.DeleteOneAsync(filter);
        if (result.DeletedCount == 0) return NotFound();

        return NoContent();
    }
}
