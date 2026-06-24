using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using SaaS.API.Services;

namespace SaaS.API.Services;

// Implementacion de IUserContext.
// Lee los datos del usuario directamente desde el token JWT de la peticion HTTP actual.
// Esto permite que cualquier controlador sepa quien esta logueado sin tener que leer el token manualmente.
public class UserContext : IUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    // Acceso rapido al usuario autenticado del contexto HTTP actual
    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    // ID del usuario logueado — lo busco en el claim "sub" del token JWT
    public string? UserId => User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                             ?? User?.FindFirst("sub")?.Value;

    // ID de la empresa del usuario — viene del claim "EmpresaId" que insertamos al generar el token
    public string? EmpresaId
    {
        get
        {
            var id = User?.FindFirst("EmpresaId")?.Value;
            return string.IsNullOrEmpty(id) ? null : id;
        }
    }

    // Rol del usuario (Superadmin, EmpresaOwner o Employee)
    public string? Role => User?.FindFirst(ClaimTypes.Role)?.Value;

    // Verifica si el usuario tiene acceso a un modulo especifico del sistema
    public bool HasPermission(string permission)
    {
        if (Role == "EmpresaOwner")
            return true; // Los propietarios del negocio tienen acceso total dentro de su empresa

        if (Role == "Superadmin" && (permission == "usuarios" || permission == "empresas"))
            return true; // El Superadmin gestiona unicamente las empresas y cuentas globales

        // Para los empleados, reviso si el permiso solicitado esta en su lista de permisos del token
        var permissions = User?.FindAll("permissions").Select(c => c.Value) ?? Enumerable.Empty<string>();
        return permissions.Contains(permission);
    }
}
