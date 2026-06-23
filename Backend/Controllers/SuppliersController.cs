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
public class SuppliersController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public SuppliersController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (!_userContext.HasPermission("proveedores"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var suppliers = await _context.Suppliers.Find(s => s.EmpresaId == empresaId).ToListAsync();
        return Ok(suppliers);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Supplier supplier)
    {
        if (!_userContext.HasPermission("proveedores"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        supplier.Id = string.Empty;
        supplier.EmpresaId = empresaId;
        supplier.FechaCreacion = DateTime.UtcNow;

        await _context.Suppliers.InsertOneAsync(supplier);
        return CreatedAtAction(nameof(GetAll), new { id = supplier.Id }, supplier);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Supplier supplier)
    {
        if (!_userContext.HasPermission("proveedores"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<Supplier>.Filter.And(
            Builders<Supplier>.Filter.Eq(s => s.Id, id),
            Builders<Supplier>.Filter.Eq(s => s.EmpresaId, empresaId)
        );

        var update = Builders<Supplier>.Update
            .Set(s => s.Nombre, supplier.Nombre)
            .Set(s => s.Telefono, supplier.Telefono)
            .Set(s => s.Correo, supplier.Correo)
            .Set(s => s.Direccion, supplier.Direccion);

        var result = await _context.Suppliers.UpdateOneAsync(filter, update);
        if (result.MatchedCount == 0) return NotFound();

        return Ok(supplier);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!_userContext.HasPermission("proveedores"))
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<Supplier>.Filter.And(
            Builders<Supplier>.Filter.Eq(s => s.Id, id),
            Builders<Supplier>.Filter.Eq(s => s.EmpresaId, empresaId)
        );

        var result = await _context.Suppliers.DeleteOneAsync(filter);
        if (result.DeletedCount == 0) return NotFound();

        return NoContent();
    }
}
