using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo central del inventario: representa cada articulo que se vende o compra en la tienda.
// Almacena tanto el precio de venta como el precio de costo para calcular la ganancia.
[BsonIgnoreExtraElements]
public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    // Empresa duena del producto (cada tienda tiene su propio catalogo)
    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    // Categoria a la que pertenece el producto (ej: Bebidas, Lacteos)
    [BsonRepresentation(BsonType.ObjectId)]
    public string CategoriaId { get; set; } = string.Empty;

    public string CodigoBarras { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;

    // Precio de venta al publico (el que se cobra en el POS)
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Precio { get; set; }

    // Precio al que se compra al proveedor (se actualiza automaticamente con cada compra)
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal PrecioCosto { get; set; }

    public int Stock { get; set; }
    // Si el stock baja de este numero, el dashboard muestra una alerta de reabastecimiento
    public int StockMinimo { get; set; }
    // URL de la imagen del producto (puede ser un enlace externo o una imagen subida)
    public string ImagenUrl { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
