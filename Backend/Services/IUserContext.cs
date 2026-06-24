namespace SaaS.API.Services;

// Interfaz que expone los datos del usuario autenticado en cada peticion HTTP.
// Los controladores la usan para saber quien esta logueado sin leer el token manualmente.
public interface IUserContext
{
    string? UserId { get; }      // ID unico del usuario logueado
    string? EmpresaId { get; }   // ID de la empresa a la que pertenece
    string? Role { get; }        // Rol del usuario: Superadmin, EmpresaOwner o Employee
    // Verifica si el usuario tiene habilitado un modulo especifico (ej: "ventas", "compras")
    bool HasPermission(string permission);
}
