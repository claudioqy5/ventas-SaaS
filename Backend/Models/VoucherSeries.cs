using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo que controla el correlativo secuencial de comprobantes por empresa y tipo de comprobante.
// Garantiza que cada empresa tenga sus propias series independientes (B001, F001, NV01)
// y que los números avancen de forma atómica y sin colisiones.
[BsonIgnoreExtraElements]
public class VoucherSeries
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    // "Boleta", "Factura", "Nota de Venta"
    public string TipoComprobante { get; set; } = "Boleta";

    // Código SUNAT: "01" = Factura, "03" = Boleta, "00" = Nota de Venta
    public string CodigoSunat { get; set; } = "03";

    // Serie del comprobante (ej: B001, F001, NV01)
    public string Serie { get; set; } = "B001";

    // Último número correlativo emitido en esta serie
    public int UltimoNumero { get; set; } = 0;

    public bool Activa { get; set; } = true;

    public DateTime FechaActualizacion { get; set; } = DateTime.UtcNow;
}
