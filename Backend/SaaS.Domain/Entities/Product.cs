using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.Domain.Entities;

[BsonIgnoreExtraElements]
public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string CategoriaId { get; set; } = string.Empty;

    public string CodigoBarras { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Precio { get; set; }

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal PrecioCosto { get; set; }

    public int Stock { get; set; }
    public int StockMinimo { get; set; }
    public string ImagenUrl { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
