using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

// Modelo que representa a un cliente registrado en el sistema.
// Los clientes se pueden seleccionar al momento de registrar una venta en el POS.
// En modo SaaS, cada cliente pertenece exclusivamente a su EmpresaId.
[BsonIgnoreExtraElements]
public class Client
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    // Empresa duena de este cliente (cada tienda gestiona su propia cartera de clientes)
    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    public string Nombres { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;

    // Documento de identidad
    public string TipoDocumento { get; set; } = "DNI"; // DNI, RUC, CE, PASAPORTE
    public string NumeroDocumento { get; set; } = string.Empty;

    // Dirección de entrega predeterminada (se actualiza automáticamente con la última compra)
    public string Direccion { get; set; } = string.Empty;
    public string Departamento { get; set; } = string.Empty;
    public string Provincia { get; set; } = string.Empty;
    public string Distrito { get; set; } = string.Empty;
    public string Referencia { get; set; } = string.Empty;

    // Autenticación de e-commerce
    public string? ClaveHash { get; set; }
    public bool EsUsuarioEcommerce { get; set; } = false;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
