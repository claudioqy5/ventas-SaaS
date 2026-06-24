using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo que representa a un usuario del sistema (puede ser Superadmin, EmpresaOwner o Empleado).
// Los permisos determinan a que modulos del sistema puede acceder cada usuario.
[BsonIgnoreExtraElements]
public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string? EmpresaId { get; set; } // Nulo si el rol es Superadmin

    public string Nombre { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    // La clave se guarda encriptada (nunca en texto plano)
    public string ClaveHash { get; set; } = string.Empty;
    public string Rol { get; set; } = "Employee"; // Roles validos: Superadmin, EmpresaOwner, Employee
    public List<string> Permisos { get; set; } = new(); // Modulos disponibles: dashboard, ventas, productos, clientes, proveedores, compras, movimientos, config
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
