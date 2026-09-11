using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo que representa una venta registrada desde el POS o la tienda virtual.
// Al guardarse, descuenta el stock de cada producto incluido en el detalle.
// En modo SaaS, cada venta pertenece exclusivamente a su EmpresaId.
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

    public string MetodoPago { get; set; } = "Efectivo"; // Efectivo, Tarjeta, Yape, Transferencia, etc.

    // Estado de pago para soportar ventas "Fiadas" (a crédito)
    public string EstadoPago { get; set; } = "Pagado"; // "Pagado" o "Fiado"

    // Indicador permanente si la venta inicio como fiado, util para el historico
    public bool FueFiado { get; set; } = false;

    // Fecha en la que la deuda (fiado) fue cancelada
    public DateTime? FechaPago { get; set; }

    // =============================================
    // DATOS DE ENTREGA (E-Commerce / Delivery)
    // Estos campos son exclusivos de ventas online y se aíslan por EmpresaId en el SaaS.
    // =============================================

    // Dirección de despacho del pedido
    public string? DireccionEntrega { get; set; }
    public string? DepartamentoEntrega { get; set; }
    public string? ProvinciaEntrega { get; set; }
    public string? DistritoEntrega { get; set; }
    public string? ReferenciaEntrega { get; set; }

    // Receptor del pedido (puede ser el comprador o un tercero)
    public bool EsEntregaATercero { get; set; } = false;
    public string? NombreReceptor { get; set; }
    public string? DniReceptor { get; set; }

    // Notas adicionales para el courier / repartidor
    public string? NotasEntrega { get; set; }

    // =============================================
    // DATOS DE FACTURACIÓN / COMPROBANTE
    // =============================================
    public string TipoComprobante { get; set; } = "Boleta"; // "Boleta" o "Factura"
    public string? RucFactura { get; set; }
    public string? RazonSocialFactura { get; set; }
    public string? DireccionFiscalFactura { get; set; }

    // Código de operación del pago (Yape, Plin, transferencia bancaria, etc.)
    public string? CodigoOperacionPago { get; set; }

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
