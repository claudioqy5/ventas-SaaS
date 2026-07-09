using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;

namespace SaaS.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RemindersController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public RemindersController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var reminders = await _context.Reminders.Find(r => r.EmpresaId == empresaId)
            .SortBy(r => r.FechaVencimiento)
            .ToListAsync();

        var today = DateTime.Today; // Comparar con fecha local
        bool updatedAny = false;

        foreach (var r in reminders)
        {
            // Si es recurrente, está Pagado y ya pasó al menos 1 día de la fecha de vencimiento
            if (r.Recurrente && r.Estado == "Pagado" && today > r.FechaVencimiento.ToLocalTime().Date)
            {
                // Mover al mismo día del mes siguiente
                r.FechaVencimiento = r.FechaVencimiento.AddMonths(1);
                r.Estado = "Pendiente";

                var filter = Builders<Reminder>.Filter.Eq(x => x.Id, r.Id);
                var update = Builders<Reminder>.Update
                    .Set(x => x.FechaVencimiento, r.FechaVencimiento)
                    .Set(x => x.Estado, r.Estado);

                await _context.Reminders.UpdateOneAsync(filter, update);
                updatedAny = true;
            }
        }

        // Si se actualizó alguno, volvemos a consultar para retornar los datos frescos y ordenados
        if (updatedAny)
        {
            reminders = await _context.Reminders.Find(r => r.EmpresaId == empresaId)
                .SortBy(r => r.FechaVencimiento)
                .ToListAsync();
        }

        return Ok(reminders);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Reminder reminder)
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        reminder.Id = string.Empty;
        reminder.EmpresaId = empresaId;
        reminder.FechaCreacion = DateTime.UtcNow;

        if (string.IsNullOrEmpty(reminder.Titulo))
            return BadRequest(new { message = "El título es obligatorio." });

        await _context.Reminders.InsertOneAsync(reminder);
        return Ok(reminder);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Reminder updated)
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<Reminder>.Filter.And(
            Builders<Reminder>.Filter.Eq(r => r.Id, id),
            Builders<Reminder>.Filter.Eq(r => r.EmpresaId, empresaId)
        );

        var existing = await _context.Reminders.Find(filter).FirstOrDefaultAsync();
        if (existing == null) return NotFound(new { message = "Recordatorio no encontrado." });

        var update = Builders<Reminder>.Update
            .Set(r => r.Titulo, updated.Titulo)
            .Set(r => r.Descripcion, updated.Descripcion)
            .Set(r => r.Monto, updated.Monto)
            .Set(r => r.FechaVencimiento, updated.FechaVencimiento)
            .Set(r => r.Estado, updated.Estado)
            .Set(r => r.Recurrente, updated.Recurrente);

        await _context.Reminders.UpdateOneAsync(filter, update);
        return Ok(new { message = "Recordatorio actualizado con éxito." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<Reminder>.Filter.And(
            Builders<Reminder>.Filter.Eq(r => r.Id, id),
            Builders<Reminder>.Filter.Eq(r => r.EmpresaId, empresaId)
        );

        var res = await _context.Reminders.DeleteOneAsync(filter);
        if (res.DeletedCount == 0) return NotFound(new { message = "Recordatorio no encontrado." });

        return Ok(new { message = "Recordatorio eliminado con éxito." });
    }
}
