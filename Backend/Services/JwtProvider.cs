using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SaaS.API.Services;
using SaaS.API.Models;

namespace SaaS.API.Services;

// Implementacion concreta de IJwtProvider.
// Se encarga de construir y firmar el token JWT que el frontend guarda en localStorage.
public class JwtProvider : IJwtProvider
{
    private readonly IConfiguration _configuration;

    public JwtProvider(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // Genera el token JWT con todos los datos del usuario incrustados como "claims"
    public string GenerateToken(User user)
    {
        // Leo la configuracion de JWT desde appsettings.json
        var secretKey = _configuration.GetValue<string>("JwtSettings:Secret") ?? "SuperSecretSaaSKeyOfLengthGreaterThan32Characters!";
        var issuer = _configuration.GetValue<string>("JwtSettings:Issuer") ?? "SaaSProvider";
        var audience = _configuration.GetValue<string>("JwtSettings:Audience") ?? "SaaSClients";
        var expiryMinutes = _configuration.GetValue<int>("JwtSettings:ExpiryMinutes", 480); // Por defecto: 8 horas

        // Genero la clave de firma con el algoritmo HMAC-SHA256
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Los "claims" son los datos que se incrustan dentro del token para identificar al usuario
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Name, user.Nombre),
            new(JwtRegisteredClaimNames.Email, user.Correo),
            new(ClaimTypes.Role, user.Rol),
            new("EmpresaId", user.EmpresaId ?? string.Empty)
        };

        // Agrego cada permiso del usuario como un claim separado para validarlos en los controladores
        foreach (var perm in user.Permisos)
        {
            claims.Add(new Claim("permissions", perm));
        }

        // Construyo y firmo el token con toda la informacion anterior
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
