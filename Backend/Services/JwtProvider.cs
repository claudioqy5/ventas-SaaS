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

public class JwtProvider : IJwtProvider
{
    private readonly IConfiguration _configuration;

    public JwtProvider(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        var secretKey = _configuration.GetValue<string>("JwtSettings:Secret") ?? "SuperSecretSaaSKeyOfLengthGreaterThan32Characters!";
        var issuer = _configuration.GetValue<string>("JwtSettings:Issuer") ?? "SaaSProvider";
        var audience = _configuration.GetValue<string>("JwtSettings:Audience") ?? "SaaSClients";
        var expiryMinutes = _configuration.GetValue<int>("JwtSettings:ExpiryMinutes", 480);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Name, user.Nombre),
            new(JwtRegisteredClaimNames.Email, user.Correo),
            new(ClaimTypes.Role, user.Rol),
            new("EmpresaId", user.EmpresaId ?? string.Empty)
        };

        foreach (var perm in user.Permisos)
        {
            claims.Add(new Claim("permissions", perm));
        }

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
