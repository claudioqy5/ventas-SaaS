using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.Application.Interfaces;
using SaaS.Domain.Entities;
using SaaS.Infrastructure.Persistence;

namespace SaaS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;
    private readonly IUserContext _userContext;

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

    [HttpPost("seed-superadmin")]
    public async Task<IActionResult> SeedSuperadmin([FromBody] LoginRequest request)
    {
        var existing = await _context.Users.Find(u => u.Rol == "Superadmin").FirstOrDefaultAsync();
        if (existing != null)
            return BadRequest(new { message = "El Superadministrador ya ha sido inicializado." });

        // 1. Create a default global system Empresa for the SaaS Administration
        var globalEmpresa = new Empresa
        {
            Nombre = "SaaS Administración Global",
            PlanSuscripcion = "System",
            FechaCreacion = DateTime.UtcNow
        };
        await _context.Empresas.InsertOneAsync(globalEmpresa);

        // 2. Create the Superadmin linked to this Empresa
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

        // Link owner to Empresa
        var filter = Builders<Empresa>.Filter.Eq(e => e.Id, globalEmpresa.Id);
        var update = Builders<Empresa>.Update.Set(e => e.PropietarioId, superadmin.Id);
        await _context.Empresas.UpdateOneAsync(filter, update);

        return Ok(new { message = "Empresa Global y Superadministrador creados con éxito." });
    }

    [HttpPost("registrar-empresa")]
    public async Task<IActionResult> RegisterEmpresa([FromBody] RegisterEmpresaRequest request)
    {
        // Check if email already exists
        var existingUser = await _context.Users.Find(u => u.Correo == request.CorreoPropietario).FirstOrDefaultAsync();
        if (existingUser != null)
            return BadRequest(new { message = "El correo electrónico ya está registrado." });

        // 1. Create Empresa
        var empresa = new Empresa
        {
            Nombre = request.NombreEmpresa,
            PlanSuscripcion = request.PlanSuscripcion,
            FechaCreacion = DateTime.UtcNow
        };
        await _context.Empresas.InsertOneAsync(empresa);

        // 2. Create Owner User
        var owner = new User
        {
            EmpresaId = empresa.Id,
            Nombre = request.NombrePropietario,
            Correo = request.CorreoPropietario,
            ClaveHash = _passwordHasher.Hash(request.ClavePropietario),
            Rol = "EmpresaOwner",
            Permisos = new List<string> { "dashboard", "ventas", "productos", "clientes", "proveedores", "compras", "movimientos", "config" }
        };
        await _context.Users.InsertOneAsync(owner);

        // Link Owner to Empresa
        var filter = Builders<Empresa>.Filter.Eq(e => e.Id, empresa.Id);
        var update = Builders<Empresa>.Update.Set(e => e.PropietarioId, owner.Id);
        await _context.Empresas.UpdateOneAsync(filter, update);

        return Ok(new { message = "Empresa y administrador creados con éxito.", empresaId = empresa.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users.Find(u => u.Correo == request.Correo && u.Activo).FirstOrDefaultAsync();
        if (user == null || !_passwordHasher.Verify(request.Clave, user.ClaveHash))
        {
            return Unauthorized(new { message = "Credenciales incorrectas o usuario inactivo." });
        }

        var token = _jwtProvider.GenerateToken(user);
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

    [Authorize]
    [HttpPost("create-user")]
    public async Task<IActionResult> CreateSubUser([FromBody] CreateUserRequest request)
    {
        var role = _userContext.Role;
        if (role != "Superadmin" && role != "EmpresaOwner")
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        if (role == "Superadmin")
        {
            if (request.Rol == "EmpresaOwner")
            {
                if (string.IsNullOrWhiteSpace(request.NombreTienda))
                {
                    return BadRequest(new { message = "El nombre de la tienda es obligatorio para crear un nuevo administrador de negocio." });
                }

                // Create new Empresa
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
                empresaId = request.EmpresaId; // Superadmin can specify empresa for other roles
            }
        }

        var existingUser = await _context.Users.Find(u => u.Correo == request.Correo).FirstOrDefaultAsync();
        if (existingUser != null)
            return BadRequest(new { message = "El correo electrónico ya está en uso." });

        var newUser = new User
        {
            EmpresaId = empresaId,
            Nombre = request.Nombre,
            Correo = request.Correo,
            ClaveHash = _passwordHasher.Hash(request.Clave),
            Rol = request.Rol, // Employee or EmpresaOwner
            Permisos = request.Permisos,
            Activo = true
        };

        await _context.Users.InsertOneAsync(newUser);

        if (role == "Superadmin" && request.Rol == "EmpresaOwner" && empresaId != null)
        {
            // Link Owner to Empresa
            var filter = Builders<Empresa>.Filter.Eq(e => e.Id, empresaId);
            var update = Builders<Empresa>.Update.Set(e => e.PropietarioId, newUser.Id);
            await _context.Empresas.UpdateOneAsync(filter, update);
        }

        return Ok(new { message = "Subusuario creado con éxito.", userId = newUser.Id });
    }

    [Authorize]
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var role = _userContext.Role;
        if (role == "Employee")
            return Forbid();

        if (role == "Superadmin")
        {
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

        var empresaId = _userContext.EmpresaId;
        var empresa = await _context.Empresas.Find(e => e.Id == empresaId).FirstOrDefaultAsync();
        var nombreEmpresa = empresa?.Nombre ?? "Mi Tienda";
        var empresaUsers = await _context.Users.Find(u => u.EmpresaId == empresaId).ToListAsync();
        return Ok(empresaUsers.Select(u => new { u.Id, u.EmpresaId, Nombre = u.Nombre, Correo = u.Correo, Rol = u.Rol, Activo = u.Activo, Permisos = u.Permisos, NombreEmpresa = nombreEmpresa }));
    }

    [Authorize]
    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
    {
        var role = _userContext.Role;
        if (role != "Superadmin" && role != "EmpresaOwner")
            return Forbid();

        var empresaId = _userContext.EmpresaId;
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        
        var existing = await _context.Users.Find(filter).FirstOrDefaultAsync();
        if (existing == null) return NotFound();

        // Security check: Owners can only edit users of their own business
        if (role == "EmpresaOwner" && existing.EmpresaId != empresaId)
            return Forbid();

        var update = Builders<User>.Update
            .Set(u => u.Nombre, request.Nombre)
            .Set(u => u.Correo, request.Correo)
            .Set(u => u.Rol, request.Rol)
            .Set(u => u.Permisos, request.Permisos)
            .Set(u => u.Activo, request.Activo);

        if (role == "Superadmin" && !string.IsNullOrEmpty(request.EmpresaId))
        {
            update = update.Set(u => u.EmpresaId, request.EmpresaId);
        }

        if (!string.IsNullOrEmpty(request.Clave))
        {
            update = update.Set(u => u.ClaveHash, _passwordHasher.Hash(request.Clave));
        }

        var result = await _context.Users.UpdateOneAsync(filter, update);
        return Ok(new { message = "Usuario actualizado con éxito." });
    }

    [Authorize]
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var role = _userContext.Role;
        if (role != "Superadmin" && role != "EmpresaOwner")
            return Forbid();

        // Prevent self-deletion
        if (_userContext.UserId == id)
            return BadRequest(new { message = "No puedes eliminar tu propia cuenta." });

        var empresaId = _userContext.EmpresaId;
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);

        var existing = await _context.Users.Find(filter).FirstOrDefaultAsync();
        if (existing == null) return NotFound();

        if (role == "EmpresaOwner" && existing.EmpresaId != empresaId)
            return Forbid();

        await _context.Users.DeleteOneAsync(filter);
        return NoContent();
    }

    [Authorize]
    [HttpGet("empresas")]
    public async Task<IActionResult> GetEmpresas()
    {
        if (_userContext.Role != "Superadmin")
            return Forbid();

        var empresas = await _context.Empresas.Find(_ => true).ToListAsync();
        return Ok(empresas.Select(e => new { e.Id, e.Nombre, e.PlanSuscripcion, e.Activo, e.FechaCreacion }));
    }
}

public record LoginRequest(string Correo, string Clave);
public record RegisterEmpresaRequest(string NombreEmpresa, string PlanSuscripcion, string NombrePropietario, string CorreoPropietario, string ClavePropietario);
public record CreateUserRequest(string? EmpresaId, string Nombre, string Correo, string Clave, string Rol, List<string> Permisos, string? NombreTienda);
public record UpdateUserRequest(string Nombre, string Correo, string? Clave, string Rol, List<string> Permisos, bool Activo, string? EmpresaId);
