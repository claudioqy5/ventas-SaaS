using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.Domain.Entities;

[BsonIgnoreExtraElements]
public class Empresa
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string Nombre { get; set; } = string.Empty;
    public string PropietarioId { get; set; } = string.Empty;
    public string PlanSuscripcion { get; set; } = "Basic"; // Basic, Premium, System
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
