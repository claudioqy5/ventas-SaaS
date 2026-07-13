using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo que representa una orden de compra a un proveedor.
// Al registrarse, incrementa el stock de cada producto incluido en el detalle.
[BsonIgnoreExtraElements]
public class Purchase
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    // Proveedor al que se le hizo la compra
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProveedorId { get; set; } = string.Empty;
    public string NombreProveedor { get; set; } = string.Empty;

    // Lista de productos incluidos en esta orden de compra
    public List<PurchaseItem> Detalles { get; set; } = new();

    // Total calculado en el servidor sumando todos los items del detalle
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Total { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string CreadoPor { get; set; } = string.Empty; // ID del usuario responsable
    public string CreadoPorNombre { get; set; } = string.Empty;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}

// Representa cada linea de producto dentro de una orden de compra
[BsonIgnoreExtraElements]
public class PurchaseItem
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProductoId { get; set; } = string.Empty;
    public string NombreProducto { get; set; } = string.Empty;
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Cantidad { get; set; }

    // Precio al que se compro este producto en esta orden (puede variar entre compras)
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal PrecioCosto { get; set; }

    // Total calculado automaticamente: Cantidad x PrecioCosto
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Total => Cantidad * PrecioCosto;
}
