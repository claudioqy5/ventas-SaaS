using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;

namespace SaaS.API.Controllers;

// Controlador que maneja todo lo relacionado a las categorias de productos
// Todas las rutas de aqui empiezan con: api/categories
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    // Conexion a la base de datos MongoDB y acceso al usuario que hace la peticion
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    // Constructor: recibe la conexion a la BD y el contexto del usuario via inyeccion de dependencias
    public CategoriesController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    // GET api/categories — devuelve todas las categorias de la empresa del usuario logueado
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Solo usuarios con permiso de "categorias" pueden ver esto
        if (!_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Traer solo las categorias que pertenecen a esta empresa (no las de otras tiendas)
        var categories = await _context.Categories.Find(c => c.EmpresaId == empresaId).ToListAsync();
        return Ok(categories);
    }

    // POST api/categories — registra una nueva categoria
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Category category)
    {
        if (!_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Limpio el Id para que MongoDB genere uno nuevo automaticamente
        category.Id = string.Empty;
        // Asigno la empresa actual para que la categoria quede vinculada a esta tienda
        category.EmpresaId = empresaId;

        await _context.Categories.InsertOneAsync(category);
        return CreatedAtAction(nameof(GetAll), new { id = category.Id }, category);
    }

    // PUT api/categories/{id} — edita una categoria existente por su Id
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Category category)
    {
        if (!_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Filtro doble: busco por Id Y por empresaId para evitar editar datos de otra tienda
        var filter = Builders<Category>.Filter.And(
            Builders<Category>.Filter.Eq(c => c.Id, id),
            Builders<Category>.Filter.Eq(c => c.EmpresaId, empresaId)
        );

        // Solo actualizo los campos que el usuario puede modificar
        var update = Builders<Category>.Update
            .Set(c => c.Nombre, category.Nombre)
            .Set(c => c.Descripcion, category.Descripcion);

        var result = await _context.Categories.UpdateOneAsync(filter, update);
        if (result.MatchedCount == 0) return NotFound();

        return Ok(category);
    }

    // DELETE api/categories/{id} — elimina una categoria por su Id
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Filtro doble para evitar borrar categorias de otras empresas por error
        var filter = Builders<Category>.Filter.And(
            Builders<Category>.Filter.Eq(c => c.Id, id),
            Builders<Category>.Filter.Eq(c => c.EmpresaId, empresaId)
        );

        var result = await _context.Categories.DeleteOneAsync(filter);
        if (result.DeletedCount == 0) return NotFound();

        return NoContent();
    }
}
