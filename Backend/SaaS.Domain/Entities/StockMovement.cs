using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.Domain.Entities;

[BsonIgnoreExtraElements]
public class StockMovement
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string ProductoId { get; set; } = string.Empty;
    public string NombreProducto { get; set; } = string.Empty;

    public string Tipo { get; set; } = "Entrada"; // Entrada, Salida, Venta, Compra, Ajuste
    public int Cantidad { get; set; }
    public int StockAnterior { get; set; }
    public int StockNuevo { get; set; }
    public string ReferenciaId { get; set; } = string.Empty; // SaleId, PurchaseId, or custom adjustment notes
    public string Motivo { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string CreadoPor { get; set; } = string.Empty; // UserId
    public string CreadoPorNombre { get; set; } = string.Empty;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
