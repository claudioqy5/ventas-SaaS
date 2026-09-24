using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

[BsonIgnoreExtraElements]
public class Complaint
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;
    
    public string NumeroReclamo { get; set; } = string.Empty; // e.g. "2024-0001"
    
    // 1. Identificación del Consumidor
    public string Nombre { get; set; } = string.Empty;
    public string Documento { get; set; } = string.Empty;
    public string Domicilio { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Apoderado { get; set; } = string.Empty;

    // 2. Identificación del Bien Contratado
    public string TipoBien { get; set; } = "Producto"; // Producto o Servicio
    public decimal Monto { get; set; }
    public string DescripcionBien { get; set; } = string.Empty;

    // 3. Detalle de la reclamación y pedido
    public string TipoReclamo { get; set; } = "Reclamo"; // Reclamo o Queja
    public string Detalle { get; set; } = string.Empty;
    public string Pedido { get; set; } = string.Empty;

    // Metadata
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public string Estado { get; set; } = "Pendiente"; // Pendiente, En Revisión, Resuelto
    public string RespuestaProveedor { get; set; } = string.Empty;
    public DateTime? FechaRespuesta { get; set; }
}
