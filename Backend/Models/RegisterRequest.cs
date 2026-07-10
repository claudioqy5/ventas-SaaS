using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo que representa una solicitud de registro de un nuevo negocio.
// Estas solicitudes son enviadas desde la página de inicio (Login/Registro)
// y son revisadas únicamente por el Superadministrador para su aprobación.
[BsonIgnoreExtraElements]
public class RegisterRequest
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string NombreEmpresa { get; set; } = string.Empty;
    public string NombrePropietario { get; set; } = string.Empty;
    public string CorreoPropietario { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Mensaje { get; set; } = string.Empty;

    // Estados posibles: "Pendiente", "Contactado", "Aprobado", "Rechazado"
    public string Estado { get; set; } = "Pendiente";

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
