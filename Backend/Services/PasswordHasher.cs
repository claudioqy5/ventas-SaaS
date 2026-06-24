using System;
using System.Security.Cryptography;
using SaaS.API.Services;

namespace SaaS.API.Services;

// Implementacion de IPasswordHasher usando el algoritmo PBKDF2 con SHA-256.
// Este metodo es resistente a ataques de fuerza bruta gracias al "salt" aleatorio y las iteraciones.
public class PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16; // 128 bits — tamano del salt aleatorio
    private const int KeySize = 32;  // 256 bits — tamano del hash resultante
    private const int Iterations = 10000; // Numero de iteraciones para dificultar ataques

    // Convierte una contrasena en texto plano a un hash seguro listo para guardar en la BD.
    // El salt aleatorio garantiza que dos usuarios con la misma clave tengan hashes diferentes.
    public string Hash(string password)
    {
        using var algorithm = new Rfc2898DeriveBytes(password, SaltSize, Iterations, HashAlgorithmName.SHA256);
        var key = algorithm.GetBytes(KeySize);
        var salt = algorithm.Salt;

        // Combino el salt + el hash en un solo arreglo de bytes para guardarlo juntos
        var hashBytes = new byte[SaltSize + KeySize];
        Array.Copy(salt, 0, hashBytes, 0, SaltSize);
        Array.Copy(key, 0, hashBytes, SaltSize, KeySize);

        return Convert.ToBase64String(hashBytes);
    }

    // Verifica si una contrasena ingresada coincide con el hash guardado.
    // Extrae el salt original del hash para recalcular y comparar byte a byte.
    public bool Verify(string password, string passwordHash)
    {
        try
        {
            var hashBytes = Convert.FromBase64String(passwordHash);
            // Extraigo el salt de los primeros 16 bytes del hash guardado
            var salt = new byte[SaltSize];
            Array.Copy(hashBytes, 0, salt, 0, SaltSize);

            // Extraigo el hash original de los 32 bytes restantes
            var key = new byte[KeySize];
            Array.Copy(hashBytes, SaltSize, key, 0, KeySize);

            // Recalculo el hash con la contrasena ingresada y el mismo salt
            using var algorithm = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
            var verifiedKey = algorithm.GetBytes(KeySize);

            // Comparo byte a byte para evitar ataques de tiempo
            for (int i = 0; i < KeySize; i++)
            {
                if (key[i] != verifiedKey[i])
                    return false;
            }

            return true;
        }
        catch
        {
            // Si ocurre cualquier error (hash corrupto, formato invalido), devuelvo falso
            return false;
        }
    }
}
