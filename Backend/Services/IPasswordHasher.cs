namespace SaaS.API.Services;

// Interfaz que define el contrato para encriptar y verificar contrasenas.
// Usamos esta abstraccion para no depender de una implementacion concreta.
public interface IPasswordHasher
{
    // Convierte una contrasena en texto plano a un hash seguro para guardar en la BD
    string Hash(string password);
    // Compara una contrasena ingresada con el hash guardado para validar el acceso
    bool Verify(string password, string passwordHash);
}
