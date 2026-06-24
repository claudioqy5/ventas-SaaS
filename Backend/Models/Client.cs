using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo que representa a un cliente registrado en el sistema.
// Los clientes se pueden seleccionar al momento de registrar una venta en el POS.
[BsonIgnoreExtraElements]
public class Client
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    // Empresa duena de este cliente (cada tienda gestiona su propia cartera de clientes)
    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    public string Nombre { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string NumeroDocumento { get; set; } = string.Empty; // Numero de identificacion tributaria (DNI, RUC, etc.)
    public string Direccion { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
