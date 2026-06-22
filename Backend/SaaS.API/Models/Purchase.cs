using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

[BsonIgnoreExtraElements]
public class Purchase
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string ProveedorId { get; set; } = string.Empty;
    public string NombreProveedor { get; set; } = string.Empty;

    public List<PurchaseItem> Detalles { get; set; } = new();

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Total { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string CreadoPor { get; set; } = string.Empty; // UserId
    public string CreadoPorNombre { get; set; } = string.Empty;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}

[BsonIgnoreExtraElements]
public class PurchaseItem
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProductoId { get; set; } = string.Empty;
    public string NombreProducto { get; set; } = string.Empty;
    public int Cantidad { get; set; }

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal PrecioCosto { get; set; }

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Total => Cantidad * PrecioCosto;
}
