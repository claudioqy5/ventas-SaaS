using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

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

    public string Tipo { get; set; } = "Entrada"; // Tipos de movimiento: Entrada, Salida, Venta, Compra, Ajuste
    public int Cantidad { get; set; }
    public int StockAnterior { get; set; }
    public int StockNuevo { get; set; }
    public string ReferenciaId { get; set; } = string.Empty; // Vinculacion del movimiento: SaleId, PurchaseId o comentarios de ajuste manual
    public string Motivo { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string CreadoPor { get; set; } = string.Empty; // ID del usuario responsable
    public string CreadoPorNombre { get; set; } = string.Empty;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
