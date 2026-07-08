using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

[BsonIgnoreExtraElements]
public class Reminder
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal? Monto { get; set; } // Opcional, para cuentas por pagar

    public DateTime FechaVencimiento { get; set; } = DateTime.UtcNow;

    public string Estado { get; set; } = "Pendiente"; // Pendiente, Pagado, Completado

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
