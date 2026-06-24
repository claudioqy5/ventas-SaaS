using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo que representa una categoria de productos (ej: Bebidas, Lacteos, Limpieza).
// Cada categoria pertenece a una empresa especifica.
[BsonIgnoreExtraElements]
public class Category
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    // Empresa a la que pertenece esta categoria (cada tienda tiene las suyas)
    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
}
