using System.Threading.Tasks;
using SaaS.API.Models;

namespace SaaS.API.Services;

public interface IApisPeruService
{
    /// <summary>
    /// Enva una Boleta o Factura a ApisPeru y devuelve el estado y las URLs generadas (XML, PDF, CDR).
    /// </summary>
    Task<(bool Success, string Message, string? XmlUrl, string? PdfUrl, string? CdrUrl, string? SunatStatus, string? Hash)> EmitirComprobanteAsync(Sale venta, Empresa empresa);
}
