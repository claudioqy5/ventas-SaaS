using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo central del inventario: representa cada articulo que se vende o compra en la tienda.
// Soporta multiples tipos de producto: unidades, peso (kg), costales y servicios.
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

    // --- TIPO DE PRODUCTO ---
    // "Unidad"   → se vende por unidades enteras (ej: cama para perro, ropa, pollo vivo)
    // "Peso"     → se vende por kilogramos, permite cantidades decimales (ej: alimento a granel)
    // "Costal"   → tiene dos precios: uno por kilo suelto y otro por costal completo
    // "Servicio" → no tiene inventario fisico (ej: grooming, baño, consulta veterinaria)
    public string TipoProducto { get; set; } = "Unidad";

    // Unidad de medida que se muestra al usuario en el POS y en tickets
    // Ej: "Unidad", "Kg", "Costal", "Servicio"
    public string UnidadMedida { get; set; } = "Unidad";

    // Si es true, el producto no descuenta inventario al venderse
    public bool EsServicio { get; set; } = false;

    // --- PRECIOS ---
    // Precio de venta al publico (el que se cobra en el POS)
    // Para tipo "Unidad" y "Peso" este es el precio principal (por unidad o por kg)
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Precio { get; set; }

    // Precio al que se compra al proveedor (se actualiza automaticamente con cada compra)
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal PrecioCosto { get; set; }

    // Solo para tipo "Costal": precio especial cuando se vende el costal completo
    // Ej: alimento 20kg → suelto cuesta S/.5/kg, pero el costal completo cuesta S/.80
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal PrecioCostal { get; set; } = 0;

    // Solo para tipo "Costal": cuantos kilos tiene un costal (define el peso del lote completo)
    // Ej: un costal de 20kg → KilosPorCostal = 20
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal KilosPorCostal { get; set; } = 0;

    // --- STOCK ---
    // Usamos decimal para soportar productos vendidos por peso (ej: 1.5 kg, 0.75 kg)
    // Para productos tipo "Unidad" siempre sera un numero entero (ej: 10.00, 25.00)
    // Para tipo "Servicio" este valor no se usa
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Stock { get; set; }

    // Si el stock baja de este numero, el dashboard muestra una alerta de reabastecimiento
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal StockMinimo { get; set; }

    // URL de la imagen del producto (puede ser un enlace externo o una imagen subida)
    public string ImagenUrl { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
