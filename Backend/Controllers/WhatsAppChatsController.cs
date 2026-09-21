using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Data;
using SaaS.API.Models;

namespace SaaS.API.Controllers;

[ApiController]
[Route("api/whatsapp-chats")]
public class WhatsAppChatsController : ControllerBase
{
    private readonly MongoDbContext _context;

    public WhatsAppChatsController(MongoDbContext context)
    {
        _context = context;
    }

    // GET api/whatsapp-chats/{empresaId}
    // Obtiene la lista de chats para el panel administrativo
    [Authorize]
    [HttpGet("{empresaId}")]
    public async Task<IActionResult> GetChats(string empresaId)
    {
        var chats = await _context.WhatsAppChats
            .Find(c => c.EmpresaId == empresaId)
            .SortByDescending(c => c.UltimoMensajeFecha)
            .ToListAsync();
            
        return Ok(chats);
    }

    // GET api/whatsapp-chats/{empresaId}/{whatsAppCliente}
    // Obtiene el historial de un chat específico para el panel administrativo
    [Authorize]
    [HttpGet("{empresaId}/{whatsAppCliente}")]
    public async Task<IActionResult> GetChat(string empresaId, string whatsAppCliente)
    {
        var chat = await _context.WhatsAppChats
            .Find(c => c.EmpresaId == empresaId && c.WhatsAppCliente == whatsAppCliente)
            .FirstOrDefaultAsync();

        if (chat == null)
            return NotFound(new { message = "Chat no encontrado" });

        return Ok(chat);
    }
}

[ApiController]
[Route("api/public/store")]
public class PublicBotChatController : ControllerBase
{
    private readonly MongoDbContext _context;

    public PublicBotChatController(MongoDbContext context)
    {
        _context = context;
    }

    // GET api/public/store/{empresaId}/bot/chat-history/{whatsAppCliente}
    // Obtiene los últimos N mensajes para inyectar al prompt de n8n
    [AllowAnonymous]
    [HttpGet("{empresaId}/bot/chat-history/{whatsAppCliente}")]
    public async Task<IActionResult> GetBotChatHistory(string empresaId, string whatsAppCliente, [FromQuery] int limit = 10)
    {
        var chat = await _context.WhatsAppChats
            .Find(c => c.EmpresaId == empresaId && c.WhatsAppCliente == whatsAppCliente)
            .FirstOrDefaultAsync();

        if (chat == null)
            return Ok(new List<ChatMessage>());

        var history = chat.Mensajes.TakeLast(limit).ToList();
        return Ok(history);
    }

    // POST api/public/store/{empresaId}/bot/chat
    // n8n llama a esto para guardar cada nuevo mensaje entrante o saliente
    [AllowAnonymous]
    [HttpPost("{empresaId}/bot/chat")]
    public async Task<IActionResult> SaveBotChatMessage(string empresaId, [FromBody] SaveChatMessageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.WhatsAppCliente) || string.IsNullOrWhiteSpace(request.Texto))
            return BadRequest(new { message = "Datos incompletos" });

        var chat = await _context.WhatsAppChats
            .Find(c => c.EmpresaId == empresaId && c.WhatsAppCliente == request.WhatsAppCliente)
            .FirstOrDefaultAsync();

        var newMessage = new ChatMessage
        {
            Emisor = request.Emisor ?? "Cliente",
            Texto = request.Texto,
            Fecha = DateTime.UtcNow
        };

        if (chat == null)
        {
            chat = new WhatsAppChat
            {
                EmpresaId = empresaId,
                WhatsAppCliente = request.WhatsAppCliente,
                NombreCliente = request.NombreCliente ?? request.WhatsAppCliente,
                UltimoMensajeFecha = DateTime.UtcNow,
                Mensajes = new List<ChatMessage> { newMessage }
            };
            await _context.WhatsAppChats.InsertOneAsync(chat);
        }
        else
        {
            var update = Builders<WhatsAppChat>.Update
                .Push(c => c.Mensajes, newMessage)
                .Set(c => c.UltimoMensajeFecha, DateTime.UtcNow);

            if (!string.IsNullOrWhiteSpace(request.NombreCliente) && chat.NombreCliente == chat.WhatsAppCliente)
            {
                update = update.Set(c => c.NombreCliente, request.NombreCliente);
            }

            await _context.WhatsAppChats.UpdateOneAsync(c => c.Id == chat.Id, update);
        }

        return Ok(new { message = "Mensaje guardado" });
    }
}

public record SaveChatMessageRequest(
    string WhatsAppCliente, 
    string Texto, 
    string? Emisor, 
    string? NombreCliente
);
