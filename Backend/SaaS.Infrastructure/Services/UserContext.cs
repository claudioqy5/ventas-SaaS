using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using SaaS.Application.Interfaces;

namespace SaaS.Infrastructure.Services;

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
        if (Role == "Superadmin" || Role == "EmpresaOwner")
            return true; // Administrators have absolute access inside their Empresa

        var permissions = User?.FindAll("permissions").Select(c => c.Value) ?? Enumerable.Empty<string>();
        return permissions.Contains(permission);
    }
}
