using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SaaS.API.Services;
using SaaS.API.Models;
using SaaS.API.Data;
using System;

namespace SaaS.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly IUserContext _userContext;

    public CouponsController(MongoDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Require valid company id (this usually doesn't require a specific permission or maybe a "configuracion" permission)
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var coupons = await _context.Coupons.Find(c => c.EmpresaId == empresaId).ToListAsync();
        return Ok(coupons);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Coupon coupon)
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        // Ensure uppercase for standard codes
        coupon.Id = string.Empty;
        coupon.EmpresaId = empresaId;
        coupon.Code = coupon.Code?.Trim().ToUpper();
        coupon.CreatedAt = DateTime.UtcNow;

        // Check if code already exists for this company
        var existing = await _context.Coupons.Find(c => c.EmpresaId == empresaId && c.Code == coupon.Code).FirstOrDefaultAsync();
        if (existing != null)
        {
            return BadRequest(new { message = "Ya existe un cupón con este código." });
        }

        await _context.Coupons.InsertOneAsync(coupon);
        return CreatedAtAction(nameof(GetAll), new { id = coupon.Id }, coupon);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Coupon coupon)
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<Coupon>.Filter.And(
            Builders<Coupon>.Filter.Eq(c => c.Id, id),
            Builders<Coupon>.Filter.Eq(c => c.EmpresaId, empresaId)
        );

        var update = Builders<Coupon>.Update
            .Set(c => c.Code, coupon.Code?.Trim().ToUpper())
            .Set(c => c.DiscountPercentage, coupon.DiscountPercentage)
            .Set(c => c.IsActive, coupon.IsActive);

        var result = await _context.Coupons.UpdateOneAsync(filter, update);
        if (result.MatchedCount == 0) return NotFound();

        return Ok(coupon);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var empresaId = _userContext.EmpresaId;
        if (string.IsNullOrEmpty(empresaId)) return BadRequest(new { message = "Falta el identificador de la empresa." });

        var filter = Builders<Coupon>.Filter.And(
            Builders<Coupon>.Filter.Eq(c => c.Id, id),
            Builders<Coupon>.Filter.Eq(c => c.EmpresaId, empresaId)
        );

        var result = await _context.Coupons.DeleteOneAsync(filter);
        if (result.DeletedCount == 0) return NotFound();

        return NoContent();
    }
}
