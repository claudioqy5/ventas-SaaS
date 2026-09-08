using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SaaS.API.Services;

namespace SaaS.API.Controllers;

/// <summary>
/// Controlador para subida de archivos de imagen desde el panel de administracion.
/// Las imagenes se almacenan en /app/uploads/images/ y se sirven como archivos estaticos.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly IUserContext _userContext;
    private readonly string _uploadsPath;

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };
    private const long MaxFileSizeBytes = 1 * 1024 * 1024; // 1 MB (Optimizado para SEO)

    public UploadsController(IUserContext userContext, IWebHostEnvironment env)
    {
        _userContext = userContext;
        _uploadsPath = Path.Combine(env.ContentRootPath, "uploads", "images");
        Directory.CreateDirectory(_uploadsPath);
    }

    /// <summary>
    /// POST api/uploads/image
    /// Recibe un archivo de imagen via multipart/form-data y devuelve su URL publica.
    /// Campo del formulario esperado: "file"
    /// </summary>
    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No se recibio ningun archivo." });

        if (file.Length > MaxFileSizeBytes)
            return BadRequest(new { message = "El archivo supera el límite de 1 MB (Optimiza tus imágenes para SEO)." });

        var ext = Path.GetExtension(file.FileName);
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { message = $"Formato no permitido. Use: {string.Join(", ", AllowedExtensions)}" });

        var uniqueName = $"{Guid.NewGuid()}{ext.ToLowerInvariant()}";
        var filePath = Path.Combine(_uploadsPath, uniqueName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var imageUrl = $"{baseUrl}/uploads/images/{uniqueName}";

        return Ok(new { url = imageUrl });
    }
}
