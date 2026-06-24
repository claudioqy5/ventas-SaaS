using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

[BsonIgnoreExtraElements]
public class Sale
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string? ClienteId { get; set; }
    public string NombreCliente { get; set; } = "Cliente General";

    public List<SaleItem> Detalles { get; set; } = new();

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Subtotal { get; set; }

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Impuesto { get; set; }

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Total { get; set; }

    public string MetodoPago { get; set; } = "Efectivo"; // Opciones de pago: Efectivo, Tarjeta, Transferencia

    [BsonRepresentation(BsonType.ObjectId)]
    public string CreadoPor { get; set; } = string.Empty; // ID del usuario responsable
    public string CreadoPorNombre { get; set; } = string.Empty;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}

[BsonIgnoreExtraElements]
public class SaleItem
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProductoId { get; set; } = string.Empty;
    public string NombreProducto { get; set; } = string.Empty;
    public int Cantidad { get; set; }

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal PrecioUnitario { get; set; }

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Total => Cantidad * PrecioUnitario;
}
