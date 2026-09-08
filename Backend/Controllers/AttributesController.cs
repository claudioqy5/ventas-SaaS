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
public class AttributesController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public AttributesController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (!_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var attributes = await _context.AttributeTypes.Find(a => a.EmpresaId == empresaId).ToListAsync();
        return Ok(attributes);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AttributeType attributeType)
    {
        if (!_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        attributeType.Id = string.Empty;
        attributeType.EmpresaId = empresaId;

        await _context.AttributeTypes.InsertOneAsync(attributeType);
        return CreatedAtAction(nameof(GetAll), new { id = attributeType.Id }, attributeType);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] AttributeType attributeType)
    {
        if (!_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<AttributeType>.Filter.And(
            Builders<AttributeType>.Filter.Eq(a => a.Id, id),
            Builders<AttributeType>.Filter.Eq(a => a.EmpresaId, empresaId)
        );

        var update = Builders<AttributeType>.Update
            .Set(a => a.Nombre, attributeType.Nombre)
            .Set(a => a.Opciones, attributeType.Opciones);

        var result = await _context.AttributeTypes.UpdateOneAsync(filter, update);
        if (result.MatchedCount == 0) return NotFound();

        return Ok(attributeType);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<AttributeType>.Filter.And(
            Builders<AttributeType>.Filter.Eq(a => a.Id, id),
            Builders<AttributeType>.Filter.Eq(a => a.EmpresaId, empresaId)
        );

        var result = await _context.AttributeTypes.DeleteOneAsync(filter);
        if (result.DeletedCount == 0) return NotFound();

        return NoContent();
    }
}
