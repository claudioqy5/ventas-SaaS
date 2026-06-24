using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;

namespace SaaS.API.Controllers;

// Controlador de autenticacion y gestion de usuarios/empresas
// Es el mas importante del sistema: maneja login, registro, creacion y eliminacion de cuentas
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;
    private readonly IUserContext _userContext;

    // Constructor: inyecta todos los servicios necesarios para autenticar y gestionar usuarios
    public AuthController(
        MongoDbContext context, 
        IPasswordHasher passwordHasher, 
        IJwtProvider jwtProvider,
        IUserContext userContext)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
        _userContext = userContext;
    }

    // POST api/auth/seed-superadmin — crea el Superadministrador inicial del sistema (solo una vez)
    [HttpPost("seed-superadmin")]
    public async Task<IActionResult> SeedSuperadmin([FromBody] LoginRequest request)
    {
        // CONSULTA: verifico si ya existe un Superadmin en la BD para no crear duplicados
        var existing = await _context.Users.Find(u => u.Rol == "Superadmin").FirstOrDefaultAsync();
        if (existing != null)
            return BadRequest(new { message = "El Superadministrador ya ha sido inicializado." });

        // INSERCION: creo la empresa global del sistema (la "tienda maestra" del SaaS)
        var globalEmpresa = new Empresa
        {
            Nombre = "SaaS Administración Global",
            PlanSuscripcion = "System",
            FechaCreacion = DateTime.UtcNow
        };
        await _context.Empresas.InsertOneAsync(globalEmpresa);

        // INSERCION: creo el usuario Superadmin con la clave encriptada
        var superadmin = new User
        {
            EmpresaId = globalEmpresa.Id,
            Nombre = "Súper Administrador",
            Correo = request.Correo,
            ClaveHash = _passwordHasher.Hash(request.Clave),
            Rol = "Superadmin",
            Permisos = new List<string> { "usuarios", "empresas" }
        };
        await _context.Users.InsertOneAsync(superadmin);

        // ACTUALIZACION: vinculo el Superadmin como propietario de la empresa global
        var filter = Builders<Empresa>.Filter.Eq(e => e.Id, globalEmpresa.Id);
        var update = Builders<Empresa>.Update.Set(e => e.PropietarioId, superadmin.Id);
        await _context.Empresas.UpdateOneAsync(filter, update);

        return Ok(new { message = "Empresa Global y Superadministrador creados con éxito." });
    }

    // POST api/auth/registrar-empresa — registra una tienda nueva junto con su administrador
    [HttpPost("registrar-empresa")]
    public async Task<IActionResult> RegisterEmpresa([FromBody] RegisterEmpresaRequest request)
    {
        // CONSULTA: verifico que el correo no este ya registrado antes de crear nada
        var existingUser = await _context.Users.Find(u => u.Correo == request.CorreoPropietario).FirstOrDefaultAsync();
        if (existingUser != null)
            return BadRequest(new { message = "El correo electrónico ya está registrado." });

        // INSERCION: creo la empresa (tienda) con el nombre y plan de suscripcion indicados
        var empresa = new Empresa
        {
            Nombre = request.NombreEmpresa,
            PlanSuscripcion = request.PlanSuscripcion,
            FechaCreacion = DateTime.UtcNow
        };
        await _context.Empresas.InsertOneAsync(empresa);

        // INSERCION: creo el usuario propietario con todos los permisos habilitados
        var owner = new User
        {
            EmpresaId = empresa.Id,
            Nombre = request.NombrePropietario,
            Correo = request.CorreoPropietario,
            ClaveHash = _passwordHasher.Hash(request.ClavePropietario),
            Rol = "EmpresaOwner",
            Permisos = new List<string> { "dashboard", "ventas", "productos", "categorias", "modificar_productos", "clientes", "proveedores", "compras", "movimientos", "config" }
        };
        await _context.Users.InsertOneAsync(owner);

        // ACTUALIZACION: guardo el Id del propietario dentro del registro de la empresa
        var filter = Builders<Empresa>.Filter.Eq(e => e.Id, empresa.Id);
        var update = Builders<Empresa>.Update.Set(e => e.PropietarioId, owner.Id);
        await _context.Empresas.UpdateOneAsync(filter, update);

        return Ok(new { message = "Empresa y administrador creados con éxito.", empresaId = empresa.Id });
    }

    // POST api/auth/login — valida las credenciales y devuelve un token JWT de sesion
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // CONSULTA: busco el usuario por correo y verifico que este activo en el sistema
        var user = await _context.Users.Find(u => u.Correo == request.Correo && u.Activo).FirstOrDefaultAsync();
        if (user == null || !_passwordHasher.Verify(request.Clave, user.ClaveHash))
        {
            return Unauthorized(new { message = "Credenciales incorrectas o usuario inactivo." });
        }

        // Genero el token JWT que el frontend guardara para autenticar las siguientes peticiones
        var token = _jwtProvider.GenerateToken(user);

        // CONSULTA: traigo el nombre de la empresa para mostrarlo en el sidebar del frontend
        var empresa = await _context.Empresas.Find(e => e.Id == user.EmpresaId).FirstOrDefaultAsync();
        var nombreEmpresa = empresa?.Nombre ?? "SaaS Administración Global";

        return Ok(new
        {
            token,
            user = new
            {
                user.Id,
                user.EmpresaId,
                Nombre = user.Nombre,
                Correo = user.Correo,
                Rol = user.Rol,
                Permisos = user.Permisos,
                NombreEmpresa = nombreEmpresa
            }
        });
    }

    // POST api/auth/create-user — crea un empleado o administrador nuevo dentro de una empresa
    [Authorize]
    [HttpPost("create-user")]
    public async Task<IActionResult> CreateSubUser([FromBody] CreateUserRequest request)
    {
        var role = _userContext.Role;
        if (role != "Superadmin" && role != "EmpresaOwner")
            return Forbid();

        var empresaId = _userContext.EmpresaId;

        // Si el Superadmin esta creando un nuevo administrador de negocio, creo una empresa nueva para el
        if (role == "Superadmin")
        {
            if (request.Rol == "EmpresaOwner")
            {
                if (string.IsNullOrWhiteSpace(request.NombreTienda))
                {
                    return BadRequest(new { message = "El nombre de la tienda es obligatorio para crear un nuevo administrador de negocio." });
                }

                // INSERCION: creo la empresa nueva para este administrador
                var nuevaEmpresa = new Empresa
                {
                    Nombre = request.NombreTienda,
                    PlanSuscripcion = "Premium",
                    FechaCreacion = DateTime.UtcNow
                };
                await _context.Empresas.InsertOneAsync(nuevaEmpresa);
                empresaId = nuevaEmpresa.Id;
            }
            else
            {
                empresaId = request.EmpresaId; // El Superadmin puede definir la empresa para otros roles
            }
        }

        // CONSULTA: verifico que el correo no este ya en uso por otro usuario
        var existingUser = await _context.Users.Find(u => u.Correo == request.Correo).FirstOrDefaultAsync();
        if (existingUser != null)
            return BadRequest(new { message = "El correo electrónico ya está en uso." });

        // INSERCION: creo el nuevo usuario con los permisos asignados por el administrador
        var newUser = new User
        {
            EmpresaId = empresaId,
            Nombre = request.Nombre,
            Correo = request.Correo,
            ClaveHash = _passwordHasher.Hash(request.Clave),
            Rol = request.Rol,
            Permisos = request.Permisos,
            Activo = true
        };
        await _context.Users.InsertOneAsync(newUser);

        // Si se creo un nuevo EmpresaOwner, actualizo la empresa para dejarlo como propietario
        if (role == "Superadmin" && request.Rol == "EmpresaOwner" && empresaId != null)
        {
            // ACTUALIZACION: vinculo el nuevo administrador como propietario de su empresa
            var filter = Builders<Empresa>.Filter.Eq(e => e.Id, empresaId);
            var update = Builders<Empresa>.Update.Set(e => e.PropietarioId, newUser.Id);
            await _context.Empresas.UpdateOneAsync(filter, update);
        }

        return Ok(new { message = "Subusuario creado con éxito.", userId = newUser.Id });
    }

    // GET api/auth/users — lista todos los usuarios visibles para el rol actual
    [Authorize]
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var role = _userContext.Role;
        if (role == "Employee")
            return Forbid();

        if (role == "Superadmin")
        {
            // CONSULTA: el Superadmin ve TODOS los usuarios y empresas del sistema completo
            var allUsers = await _context.Users.Find(_ => true).ToListAsync();
            var allEmpresas = await _context.Empresas.Find(_ => true).ToListAsync();
            var empresaMap = allEmpresas.ToDictionary(e => e.Id, e => e.Nombre);

            var userDtos = allUsers.Select(u => new
            {
                u.Id,
                u.EmpresaId,
                Nombre = u.Nombre,
                Correo = u.Correo,
                Rol = u.Rol,
                Permisos = u.Permisos,
                Activo = u.Activo,
                NombreEmpresa = u.EmpresaId != null && empresaMap.TryGetValue(u.EmpresaId, out var empName) ? empName : "Sin Tienda"
            });
            return Ok(userDtos);
        }

        // CONSULTA: el EmpresaOwner solo ve los usuarios de su propia empresa
        var empresaId = _userContext.EmpresaId;
        var empresa = await _context.Empresas.Find(e => e.Id == empresaId).FirstOrDefaultAsync();
        var nombreEmpresa = empresa?.Nombre ?? "Mi Tienda";
        var empresaUsers = await _context.Users.Find(u => u.EmpresaId == empresaId).ToListAsync();
        return Ok(empresaUsers.Select(u => new { u.Id, u.EmpresaId, Nombre = u.Nombre, Correo = u.Correo, Rol = u.Rol, Activo = u.Activo, Permisos = u.Permisos, NombreEmpresa = nombreEmpresa }));
    }

    // PUT api/auth/users/{id} — edita un usuario existente (nombre, correo, permisos, clave, estado)
    [Authorize]
    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
    {
        var role = _userContext.Role;
        if (role != "Superadmin" && role != "EmpresaOwner")
            return Forbid();

        var empresaId = _userContext.EmpresaId;

        // CONSULTA: verifico que el usuario a editar exista antes de intentar modificarlo
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        var existing = await _context.Users.Find(filter).FirstOrDefaultAsync();
        if (existing == null) return NotFound();

        // Control de seguridad: los administradores solo pueden editar colaboradores de su propia empresa
        if (role == "EmpresaOwner" && existing.EmpresaId != empresaId)
            return Forbid();

        // ACTUALIZACION: modifico los campos del usuario (nombre, correo, rol, permisos y estado activo)
        var update = Builders<User>.Update
            .Set(u => u.Nombre, request.Nombre)
            .Set(u => u.Correo, request.Correo)
            .Set(u => u.Rol, request.Rol)
            .Set(u => u.Permisos, request.Permisos)
            .Set(u => u.Activo, request.Activo);

        // El Superadmin puede mover a un usuario a otra empresa si lo necesita
        if (role == "Superadmin" && !string.IsNullOrEmpty(request.EmpresaId))
        {
            update = update.Set(u => u.EmpresaId, request.EmpresaId);
        }

        // Si se provee una nueva clave, la encripto y la actualizo tambien
        if (!string.IsNullOrEmpty(request.Clave))
        {
            update = update.Set(u => u.ClaveHash, _passwordHasher.Hash(request.Clave));
        }

        // ACTUALIZACION: aplico todos los cambios al documento del usuario en la BD
        var result = await _context.Users.UpdateOneAsync(filter, update);
        return Ok(new { message = "Usuario actualizado con éxito." });
    }

    // DELETE api/auth/users/{id} — elimina un usuario del sistema
    [Authorize]
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var role = _userContext.Role;
        if (role != "Superadmin" && role != "EmpresaOwner")
            return Forbid();

        // Seguridad: el sistema no permite que un usuario se elimine a si mismo
        if (_userContext.UserId == id)
            return BadRequest(new { message = "No puedes eliminar tu propia cuenta." });

        var empresaId = _userContext.EmpresaId;

        // CONSULTA: verifico que el usuario exista antes de intentar borrarlo
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        var existing = await _context.Users.Find(filter).FirstOrDefaultAsync();
        if (existing == null) return NotFound();

        // El EmpresaOwner solo puede eliminar colaboradores de su propia empresa
        if (role == "EmpresaOwner" && existing.EmpresaId != empresaId)
            return Forbid();

        // ELIMINACION: borro definitivamente el usuario de la base de datos
        await _context.Users.DeleteOneAsync(filter);
        return NoContent();
    }

    // GET api/auth/empresas — lista todas las empresas del sistema (solo para Superadmin)
    [Authorize]
    [HttpGet("empresas")]
    public async Task<IActionResult> GetEmpresas()
    {
        if (_userContext.Role != "Superadmin")
            return Forbid();

        // CONSULTA: traigo todas las empresas registradas en el sistema
        var empresas = await _context.Empresas.Find(_ => true).ToListAsync();
        return Ok(empresas.Select(e => new { e.Id, e.Nombre, e.PlanSuscripcion, e.Activo, e.FechaCreacion }));
    }
}

// Modelos de peticion (DTOs) — definen la estructura de los datos que llegan en cada endpoint
public record LoginRequest(string Correo, string Clave);
public record RegisterEmpresaRequest(string NombreEmpresa, string PlanSuscripcion, string NombrePropietario, string CorreoPropietario, string ClavePropietario);
public record CreateUserRequest(string? EmpresaId, string Nombre, string Correo, string Clave, string Rol, List<string> Permisos, string? NombreTienda);
public record UpdateUserRequest(string Nombre, string Correo, string? Clave, string Rol, List<string> Permisos, bool Activo, string? EmpresaId);
