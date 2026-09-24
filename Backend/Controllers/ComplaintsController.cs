using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Data;
using SaaS.API.Models;
using System;
using System.Threading.Tasks;

namespace SaaS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComplaintsController : ControllerBase
{
    private readonly MongoDbContext _context;

    public ComplaintsController(MongoDbContext context)
    {
        _context = context;
    }

    // POST: api/complaints
    [HttpPost]
    public async Task<IActionResult> CreateComplaint([FromBody] Complaint complaint)
    {
        if (string.IsNullOrEmpty(complaint.EmpresaId))
        {
            return BadRequest(new { message = "Se requiere el ID de la empresa." });
        }

        if (string.IsNullOrEmpty(complaint.Nombre) || string.IsNullOrEmpty(complaint.Documento) || string.IsNullOrEmpty(complaint.Detalle))
        {
            return BadRequest(new { message = "Faltan datos obligatorios (Nombre, Documento, Detalle)." });
        }

        // Generar un correlativo simple basado en el año y la cantidad de reclamos de esta empresa
        var year = DateTime.UtcNow.Year;
        var count = await _context.Complaints.CountDocumentsAsync(c => c.EmpresaId == complaint.EmpresaId && c.FechaCreacion.Year == year);
        complaint.NumeroReclamo = $"{year}-{(count + 1):D4}"; // ej: 2026-0001
        
        complaint.FechaCreacion = DateTime.UtcNow;
        complaint.Estado = "Pendiente";

        await _context.Complaints.InsertOneAsync(complaint);

        return Ok(new { 
            message = "Reclamo registrado exitosamente", 
            numeroReclamo = complaint.NumeroReclamo,
            id = complaint.Id 
        });
    }

    // GET: api/complaints/empresa/{empresaId}
    [HttpGet("empresa/{empresaId}")]
    public async Task<IActionResult> GetByEmpresa(string empresaId)
    {
        var complaints = await _context.Complaints
            .Find(c => c.EmpresaId == empresaId)
            .SortByDescending(c => c.FechaCreacion)
            .ToListAsync();
            
        return Ok(complaints);
    }
}
