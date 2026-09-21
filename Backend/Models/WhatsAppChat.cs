using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SaaS.API.Models;

public class WhatsAppChat
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("empresaId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string EmpresaId { get; set; } = string.Empty;

    [BsonElement("whatsAppCliente")]
    public string WhatsAppCliente { get; set; } = string.Empty;

    [BsonElement("nombreCliente")]
    public string NombreCliente { get; set; } = string.Empty;

    [BsonElement("ultimoMensajeFecha")]
    public DateTime UltimoMensajeFecha { get; set; }

    [BsonElement("mensajes")]
    public List<ChatMessage> Mensajes { get; set; } = new List<ChatMessage>();
}

public class ChatMessage
{
    [BsonElement("emisor")]
    public string Emisor { get; set; } = string.Empty; // "Cliente" o "Bot" o "Humano"

    [BsonElement("texto")]
    public string Texto { get; set; } = string.Empty;

    [BsonElement("fecha")]
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
}
