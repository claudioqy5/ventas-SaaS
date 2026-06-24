using SaaS.API.Models;

namespace SaaS.API.Services;

// Interfaz que define el contrato para generar tokens JWT.
// Cualquier clase que implemente esto puede usarse para crear tokens de sesion.
public interface IJwtProvider
{
    // Genera un token JWT firmado con los datos del usuario (Id, rol, permisos, empresa)
    string GenerateToken(User user);
}
