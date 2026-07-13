using System;
using System.Collections.Generic;
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
public class PaymentMethodsController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public PaymentMethodsController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (!_userContext.HasPermission("formas_pago")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId))
            return BadRequest(new { message = "Falta el identificador de la empresa." });

        var methods = await _context.PaymentMethods
            .Find(m => m.EmpresaId == empresaId)
            .ToListAsync();

        return Ok(methods);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PaymentMethod method)
    {
        if (!_userContext.HasPermission("formas_pago")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId))
            return BadRequest(new { message = "Falta el identificador de la empresa." });

        if (string.IsNullOrWhiteSpace(method.Nombre))
            return BadRequest(new { message = "El nombre es obligatorio." });

        method.Id = string.Empty; // Asegurar que MongoDB genere el ID
        method.EmpresaId = empresaId;
        method.CreadoPor = _userContext.UserId;
        method.FechaCreacion = DateTime.UtcNow;
        method.Activo = true;

        await _context.PaymentMethods.InsertOneAsync(method);
        return CreatedAtAction(nameof(GetAll), new { id = method.Id }, method);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] PaymentMethod updatedMethod)
    {
        if (!_userContext.HasPermission("formas_pago")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId))
            return BadRequest(new { message = "Falta el identificador de la empresa." });

        if (string.IsNullOrWhiteSpace(updatedMethod.Nombre))
            return BadRequest(new { message = "El nombre es obligatorio." });

        var existing = await _context.PaymentMethods
            .Find(m => m.Id == id && m.EmpresaId == empresaId)
            .FirstOrDefaultAsync();

        if (existing == null)
            return NotFound(new { message = "Método de pago no encontrado." });

        var updateDef = Builders<PaymentMethod>.Update
            .Set(m => m.Nombre, updatedMethod.Nombre)
            .Set(m => m.Activo, updatedMethod.Activo);

        await _context.PaymentMethods.UpdateOneAsync(m => m.Id == id, updateDef);
        return Ok(new { message = "Método actualizado correctamente." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!_userContext.HasPermission("formas_pago")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId))
            return BadRequest(new { message = "Falta el identificador de la empresa." });

        var result = await _context.PaymentMethods
            .DeleteOneAsync(m => m.Id == id && m.EmpresaId == empresaId);

        if (result.DeletedCount == 0)
            return NotFound(new { message = "Método de pago no encontrado." });

        return Ok(new { message = "Método eliminado correctamente." });
    }
}
