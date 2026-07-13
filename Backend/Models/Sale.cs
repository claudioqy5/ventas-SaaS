using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo que representa una venta registrada desde el POS.
// Al guardarse, descuenta el stock de cada producto incluido en el detalle.
[BsonIgnoreExtraElements]
public class Sale
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    // Cliente al que se le hizo la venta (puede ser nulo si es venta rapida sin cliente registrado)
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ClienteId { get; set; }
    public string NombreCliente { get; set; } = "Cliente General";

    // Lista de productos vendidos en esta transaccion
    public List<SaleItem> Detalles { get; set; } = new();

    // Subtotal antes de impuesto
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Subtotal { get; set; }

    // Monto del impuesto aplicado (calculado en el servidor)
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Impuesto { get; set; }

    // Total final que pago el cliente
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Total { get; set; }

    public string MetodoPago { get; set; } = "Efectivo"; // Opciones de pago: Efectivo, Tarjeta, Transferencia, etc.

    // Estado de pago para soportar ventas "Fiadas" (a crédito)
    public string EstadoPago { get; set; } = "Pagado"; // "Pagado" o "Fiado"
    
    // Indicador permanente si la venta inicio como fiado, util para el historico
    public bool FueFiado { get; set; } = false;

    // Fecha en la que la deuda (fiado) fue cancelada
    public DateTime? FechaPago { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string CreadoPor { get; set; } = string.Empty; // ID del usuario responsable
    public string CreadoPorNombre { get; set; } = string.Empty;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public bool Revertida { get; set; } = false;
    public DateTime? FechaReversion { get; set; }
    public string? RevertidaPorNombre { get; set; }
}

// Representa cada linea de producto dentro de una venta
[BsonIgnoreExtraElements]
public class SaleItem
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProductoId { get; set; } = string.Empty;
    public string NombreProducto { get; set; } = string.Empty;

    // Cantidad en la unidad de medida base (ej: Kilos o Unidades) para descontar stock
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Cantidad { get; set; }

    // Precio unitario base calculado para el total (ej: total / cantidad)
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal PrecioUnitario { get; set; }

    // Campos informativos para el ticket/comprobante
    public string UnidadMedida { get; set; } = "Unidad"; // "Kg", "Unidad", "Servicio"
    public string Presentacion { get; set; } = "Unidad"; // "Kg", "Costal", "Unidad", "Servicio"

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal CantidadPresentacion { get; set; } // Ej: 1 costal, o 2.5 kg

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal PrecioPresentacion { get; set; } // Ej: S/. 160.00 o S/. 10.00

    // Total de esta linea calculado automaticamente: Cantidad x PrecioUnitario
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Total => Cantidad * PrecioUnitario;
}
