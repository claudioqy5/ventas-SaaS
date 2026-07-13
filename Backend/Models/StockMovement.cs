using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo que registra cada entrada o salida del inventario.
// Se genera automaticamente al crear una venta, una compra o un ajuste manual.
// Sirve como auditoria completa del historial de movimientos del almacen.
[BsonIgnoreExtraElements]
public class StockMovement
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    // Producto al que corresponde este movimiento
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProductoId { get; set; } = string.Empty;
    public string NombreProducto { get; set; } = string.Empty;

    public string Tipo { get; set; } = "Entrada"; // Tipos de movimiento: Entrada, Salida, Venta, Compra, Ajuste
    // Usamos decimal para soportar movimientos de productos por peso (ej: 1.5 kg)
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Cantidad { get; set; }
    // Stock antes del movimiento (para tener trazabilidad del historial)
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal StockAnterior { get; set; }
    // Stock resultante despues del movimiento
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal StockNuevo { get; set; }
    public string ReferenciaId { get; set; } = string.Empty; // Vinculacion del movimiento: SaleId, PurchaseId o comentarios de ajuste manual
    public string Motivo { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string CreadoPor { get; set; } = string.Empty; // ID del usuario responsable
    public string CreadoPorNombre { get; set; } = string.Empty;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
