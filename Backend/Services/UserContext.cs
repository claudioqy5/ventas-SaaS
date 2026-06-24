using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using SaaS.API.Services;

namespace SaaS.API.Services;

public class UserContext : IUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public string? UserId => User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                             ?? User?.FindFirst("sub")?.Value;

    public string? EmpresaId
    {
        get
        {
            var id = User?.FindFirst("EmpresaId")?.Value;
            return string.IsNullOrEmpty(id) ? null : id;
        }
    }

    public string? Role => User?.FindFirst(ClaimTypes.Role)?.Value;

    public bool HasPermission(string permission)
    {
        if (Role == "EmpresaOwner")
            return true; // Los propietarios del negocio tienen acceso total dentro de su empresa

        if (Role == "Superadmin" && (permission == "usuarios" || permission == "empresas"))
            return true; // El Superadmin gestiona unicamente las empresas y cuentas globales

        var permissions = User?.FindAll("permissions").Select(c => c.Value) ?? Enumerable.Empty<string>();
        return permissions.Contains(permission);
    }
}
