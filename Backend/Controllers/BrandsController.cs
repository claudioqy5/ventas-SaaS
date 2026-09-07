using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;

namespace SaaS.API.Controllers;

// Controlador que maneja todo lo relacionado a las marcas de productos
// Todas las rutas de aqui empiezan con: api/brands
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    // Conexion a la base de datos MongoDB y acceso al usuario que hace la peticion
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    // Constructor: recibe la conexion a la BD y el contexto del usuario via inyeccion de dependencias
    public BrandsController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    // GET api/brands — devuelve todas las marcas de la empresa del usuario logueado
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Usamos el mismo permiso que categorias o uno propio. 
        // Asumiendo que el usuario tiene acceso a productos, puede ver marcas. 
        // O usamos "categorias" / "marcas". Asumiremos que requieren permiso de "categorias" o añadimos "marcas" al AuthStore frontend luego si lo prefieren. 
        // Usaremos "categorias" por simplificar, o mejor "productos" ya que las marcas son de los productos.
        if (!_userContext.HasPermission("productos") && !_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Traer solo las marcas que pertenecen a esta empresa (no las de otras tiendas)
        var brands = await _context.Brands.Find(b => b.EmpresaId == empresaId).ToListAsync();
        return Ok(brands);
    }

    // POST api/brands — registra una nueva marca
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Brand brand)
    {
        if (!_userContext.HasPermission("productos") && !_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Limpio el Id para que MongoDB genere uno nuevo automaticamente
        brand.Id = string.Empty;
        // Asigno la empresa actual para que la marca quede vinculada a esta tienda
        brand.EmpresaId = empresaId;

        await _context.Brands.InsertOneAsync(brand);
        return CreatedAtAction(nameof(GetAll), new { id = brand.Id }, brand);
    }

    // PUT api/brands/{id} — edita una marca existente por su Id
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Brand brand)
    {
        if (!_userContext.HasPermission("productos") && !_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Filtro doble: busco por Id Y por empresaId para evitar editar datos de otra tienda
        var filter = Builders<Brand>.Filter.And(
            Builders<Brand>.Filter.Eq(b => b.Id, id),
            Builders<Brand>.Filter.Eq(b => b.EmpresaId, empresaId)
        );

        // Solo actualizo los campos que el usuario puede modificar
        var update = Builders<Brand>.Update
            .Set(b => b.Nombre, brand.Nombre)
            .Set(b => b.Descripcion, brand.Descripcion);

        var result = await _context.Brands.UpdateOneAsync(filter, update);
        if (result.MatchedCount == 0) return NotFound();

        return Ok(brand);
    }

    // DELETE api/brands/{id} — elimina una marca por su Id
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!_userContext.HasPermission("productos") && !_userContext.HasPermission("categorias")) return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Filtro doble para evitar borrar marcas de otras empresas por error
        var filter = Builders<Brand>.Filter.And(
            Builders<Brand>.Filter.Eq(b => b.Id, id),
            Builders<Brand>.Filter.Eq(b => b.EmpresaId, empresaId)
        );

        var result = await _context.Brands.DeleteOneAsync(filter);
        if (result.DeletedCount == 0) return NotFound();

        return NoContent();
    }
}
