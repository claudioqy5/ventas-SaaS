using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo que representa una tienda o negocio dentro del sistema SaaS.
// Cada empresa tiene sus propios productos, clientes, ventas y usuarios.
// El Superadmin puede gestionar multiples empresas desde su panel.
[BsonIgnoreExtraElements]
public class Empresa
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string Nombre { get; set; } = string.Empty;
    // ID del usuario propietario principal de la empresa
    public string PropietarioId { get; set; } = string.Empty;
    public string PlanSuscripcion { get; set; } = "Basic"; // Planes de suscripcion: Basic, Premium, System
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
