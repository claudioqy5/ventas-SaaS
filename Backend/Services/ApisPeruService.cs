using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using SaaS.API.Models;

namespace SaaS.API.Services;

public class ApisPeruService : IApisPeruService
{
    private readonly HttpClient _httpClient;
    private readonly IWebHostEnvironment _env;
    private const string BASE_URL = "https://facturacion.apisperu.com/api/v1";

    public ApisPeruService(HttpClient httpClient, IWebHostEnvironment env)
    {
        _httpClient = httpClient;
        _env = env;
    }

    public async Task<(bool Success, string Message, string? XmlUrl, string? PdfUrl, string? CdrUrl, string? SunatStatus, string? Hash)> EmitirComprobanteAsync(Sale venta, Empresa empresa)
    {
        try
        {
            if (string.IsNullOrEmpty(empresa.ApisPeruToken))
                return (false, "La empresa no tiene configurado el Token de ApisPeru.", null, null, null, "ERROR_AUTH", null);

            if (string.IsNullOrEmpty(empresa.Ruc) || string.IsNullOrEmpty(empresa.RazonSocial))
                return (false, "Faltan configurar los datos fiscales de la empresa (RUC o Razón Social).", null, null, null, "ERROR_VALIDATION", null);

            var rucEmpresa = empresa.Ruc;
            var token = empresa.ApisPeruToken;

            // Determinar Tipo de Documento: "03" = Boleta, "01" = Factura
            var tipoDocComprobante = venta.CodigoTipoComprobanteSunat ?? (venta.TipoComprobante.ToLower() == "factura" ? "01" : "03");
            var serieComprobante = venta.Serie ?? (tipoDocComprobante == "01" ? "F001" : "B001");
            var correlativoStr = venta.NumeroCorrelativo.ToString();

            // Determinar Cliente
            string clienteTipoDoc = "0"; // 0 = Sin doc, 1 = DNI, 6 = RUC
            string clienteNumDoc = "00000000";
            string clienteRazonSocial = "CONSUMIDOR FINAL";

            if (!string.IsNullOrEmpty(venta.ClienteNumeroDocumento))
            {
                clienteNumDoc = venta.ClienteNumeroDocumento.Trim();
                if (clienteNumDoc.Length == 8) clienteTipoDoc = "1";
                else if (clienteNumDoc.Length == 11) clienteTipoDoc = "6";

                clienteRazonSocial = venta.ClienteRazonSocial ?? venta.NombreCliente;
            }
            
            // Validación de Factura: Obliga RUC (6) y longitud 11
            if (tipoDocComprobante == "01" && (clienteTipoDoc != "6" || clienteNumDoc.Length != 11))
            {
                return (false, "Para emitir una Factura es obligatorio un cliente con RUC válido (11 dígitos).", null, null, null, "ERROR_VALIDATION", null);
            }

            var buyerData = new
            {
                tipoDoc = clienteTipoDoc,
                numDoc = clienteNumDoc,
                rznSocial = clienteRazonSocial,
                address = new
                {
                    direccion = venta.ClienteDireccion ?? "-"
                }
            };

            // Mapeo de Detalle de Venta con IGV 18% (Gravadas)
            var details = venta.Detalles.Select(d => {
                var pvpTotalLinea = (double)Math.Round(d.Total, 2);
                var pvpUnitario = (double)Math.Round(d.PrecioUnitario, 2);
                
                var valorUnitarioSinIgv = pvpUnitario / 1.18; // Base
                var valorVentaSinIgv = pvpTotalLinea / 1.18; // Base de la línea
                var igvDeLaLinea = pvpTotalLinea - valorVentaSinIgv; 

                return new
                {
                    codProducto = d.ProductoId,
                    unidad = "NIU", // Código SUNAT para "Unidad" (Bienes)
                    cantidad = (double)d.Cantidad,
                    descripcion = d.NombreProducto,
                    mtoValorUnitario = Math.Round(valorUnitarioSinIgv, 5),
                    mtoPrecioUnitario = pvpUnitario,
                    mtoValorVenta = Math.Round(valorVentaSinIgv, 2),
                    mtoBaseIgv = Math.Round(valorVentaSinIgv, 2),
                    porcentajeIgv = 18.0,
                    igv = Math.Round(igvDeLaLinea, 2),
                    tipAfeIgv = "10", // 10 = Gravado - Operación Onerosa
                    totalImpuestos = Math.Round(igvDeLaLinea, 2)
                };
            }).ToList();

            var totalVenta = (double)Math.Round(venta.Total, 2);
            var mtoOperGravadas = details.Sum(x => x.mtoBaseIgv);
            var mtoIgvTotal = details.Sum(x => x.igv);

            var comprobantePayload = new
            {
                ublVersion = "2.1",
                tipoOperacion = "0101", // Venta Interna
                tipoDoc = tipoDocComprobante,
                serie = serieComprobante,
                correlativo = correlativoStr,
                fechaEmision = venta.FechaCreacion.ToString("yyyy-MM-dd") + "T" + venta.FechaCreacion.ToString("HH:mm:ss") + "-05:00",
                formaPago = new
                {
                    moneda = "PEN",
                    tipo = venta.EstadoPago == "Fiado" ? "Credito" : "Contado"
                },
                tipoMoneda = "PEN",
                client = buyerData,
                company = new
                {
                    ruc = rucEmpresa,
                    razonSocial = empresa.RazonSocial,
                    nombreComercial = empresa.Nombre,
                    address = new
                    {
                        ubigueo = empresa.Ubigeo ?? "150101",
                        direccion = empresa.DireccionFiscal ?? "Av Principal 123",
                        provincia = empresa.Provincia ?? "LIMA",
                        departamento = empresa.Departamento ?? "LIMA",
                        distrito = empresa.Distrito ?? "LIMA",
                        codLocal = empresa.CodigoLocal ?? "0000"
                    }
                },
                mtoOperGravadas = Math.Round(mtoOperGravadas, 2),
                mtoIGV = Math.Round(mtoIgvTotal, 2),
                totalImpuestos = Math.Round(mtoIgvTotal, 2),
                valorVenta = Math.Round(mtoOperGravadas, 2),
                subTotal = totalVenta,
                mtoImpVenta = totalVenta,
                details = details,
                legends = new[]
                {
                    new { code = "1000", value = $"SON {NumeroALetras(venta.Total)} SOLES" }
                }
            };

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var jsonPayload = JsonSerializer.Serialize(comprobantePayload);
            
            var response = await _httpClient.PostAsync(
                $"{BASE_URL}/invoice/send",
                new StringContent(jsonPayload, Encoding.UTF8, "application/json")
            );

            var responseBody = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
                return (false, $"Error APIsPERU (HTTP {(int)response.StatusCode}): {responseBody}", null, null, null, "ERROR", null);

            var result = JsonDocument.Parse(responseBody);
            string? xmlUrl = null, pdfUrl = null, cdrUrl = null, sunatStatus = "ACEPTADO", hashString = null;

            var serieCorrelativo = $"{serieComprobante}-{correlativoStr.PadLeft(8, '0')}";
            var storageDir = Path.Combine(_env.ContentRootPath, "uploads", "comprobantes", rucEmpresa);
            Directory.CreateDirectory(storageDir);

            // 1. Extraer Hash
            if (result.RootElement.TryGetProperty("hash", out var hashProp))
                hashString = hashProp.GetString();

            // 2. Extraer y guardar XML (Multifuente: xml, xmlSigned, document)
            string? xmlContent = null;
            if (result.RootElement.TryGetProperty("xml", out var xmlProp))
                xmlContent = xmlProp.GetString();
            if (string.IsNullOrEmpty(xmlContent) && result.RootElement.TryGetProperty("xmlSigned", out var xmlSignedProp))
                xmlContent = xmlSignedProp.GetString();
            if (string.IsNullOrEmpty(xmlContent) && result.RootElement.TryGetProperty("document", out var docProp))
                xmlContent = docProp.GetString();
            
            if (!string.IsNullOrEmpty(xmlContent))
            {
                try
                {
                    byte[] xmlBytes;
                    try { xmlBytes = Convert.FromBase64String(xmlContent); }
                    catch { xmlBytes = Encoding.UTF8.GetBytes(xmlContent); }

                    var xmlFileName = $"{rucEmpresa}-{tipoDocComprobante}-{serieCorrelativo}.xml";
                    var xmlPath = Path.Combine(storageDir, xmlFileName);
                    await File.WriteAllBytesAsync(xmlPath, xmlBytes);
                    xmlUrl = $"/uploads/comprobantes/{rucEmpresa}/{xmlFileName}";
                }
                catch { }
            }

            // 3. Extraer y guardar CDR (Multifuente: cdr, cdrZip en raíz, sunatResponse.cdr, sunatResponse.cdrZip)
            string? cdrContent = null;
            if (result.RootElement.TryGetProperty("cdr", out var cdrProp))
                cdrContent = cdrProp.GetString();
            if (string.IsNullOrEmpty(cdrContent) && result.RootElement.TryGetProperty("cdrZip", out var cdrZipProp))
                cdrContent = cdrZipProp.GetString();

            if (string.IsNullOrEmpty(cdrContent) && result.RootElement.TryGetProperty("sunatResponse", out var sr))
            {
                if (sr.TryGetProperty("cdr", out var srCdr))
                    cdrContent = srCdr.GetString();
                if (string.IsNullOrEmpty(cdrContent) && sr.TryGetProperty("cdrZip", out var srCdrZip))
                    cdrContent = srCdrZip.GetString();
            }
                
            if (!string.IsNullOrEmpty(cdrContent))
            {
                try
                {
                    byte[] cdrBytes;
                    try { cdrBytes = Convert.FromBase64String(cdrContent); }
                    catch { cdrBytes = Encoding.UTF8.GetBytes(cdrContent); }

                    var cdrFileName = $"R-{rucEmpresa}-{tipoDocComprobante}-{serieCorrelativo}.zip";
                    var cdrPath = Path.Combine(storageDir, cdrFileName);
                    await File.WriteAllBytesAsync(cdrPath, cdrBytes);
                    cdrUrl = $"/uploads/comprobantes/{rucEmpresa}/{cdrFileName}";
                }
                catch { }
            }

            // 4. Fallback URLs directas PDF (APIsPERU a veces devuelve "links" o "pdfUrl")
            if (string.IsNullOrEmpty(xmlUrl))
            {
                if (result.RootElement.TryGetProperty("links", out var links))
                    xmlUrl = links.TryGetProperty("xml", out var lx) ? lx.GetString() : null;
                xmlUrl ??= result.RootElement.TryGetProperty("xmlUrl", out var xu) ? xu.GetString() : null;
                xmlUrl ??= result.RootElement.TryGetProperty("linkXml", out var lxu) ? lxu.GetString() : null;
            }
            if (string.IsNullOrEmpty(pdfUrl))
            {
                if (result.RootElement.TryGetProperty("links", out var links2))
                    pdfUrl = links2.TryGetProperty("pdf", out var lp) ? lp.GetString() : null;
                pdfUrl ??= result.RootElement.TryGetProperty("pdfUrl", out var pu) ? pu.GetString() : null;
                pdfUrl ??= result.RootElement.TryGetProperty("linkPdf", out var lpu) ? lpu.GetString() : null;
            }
            if (string.IsNullOrEmpty(cdrUrl))
            {
                if (result.RootElement.TryGetProperty("links", out var links3))
                    cdrUrl = links3.TryGetProperty("cdr", out var lc) ? lc.GetString() : null;
                cdrUrl ??= result.RootElement.TryGetProperty("cdrUrl", out var cu) ? cu.GetString() : null;
                cdrUrl ??= result.RootElement.TryGetProperty("linkCdr", out var lcu) ? lcu.GetString() : null;
            }

            // 5. Estado SUNAT y Verificación de Errores
            bool isSuccess = true;
            string returnMessage = "Comprobante emitido y aceptado en SUNAT.";

            // Revisar si existe un error explícito de SUNAT
            if (result.RootElement.TryGetProperty("sunatResponse", out var srObj))
            {
                if (srObj.TryGetProperty("success", out var sProp) && sProp.ValueKind == JsonValueKind.False)
                {
                    if (srObj.TryGetProperty("error", out var errObj))
                    {
                        var errCode = errObj.TryGetProperty("code", out var ec) ? ec.GetString() : "";
                        var errMsg = errObj.TryGetProperty("message", out var em) ? em.GetString() : "Error en SUNAT";
                        
                        // 1033 = El comprobante fue registrado previamente. Lo tratamos como "Éxito" porque ya fue aceptado.
                        if (errCode == "1033")
                        {
                            isSuccess = true;
                            sunatStatus = "ACEPTADO (Registrado previamente)";
                            returnMessage = "Comprobante aceptado previamente en SUNAT.";
                        }
                        else
                        {
                            isSuccess = false;
                            returnMessage = $"SUNAT Error {errCode}: {errMsg}";
                            sunatStatus = returnMessage;
                        }
                    }
                    else
                    {
                        isSuccess = false;
                        returnMessage = "SUNAT no aceptó el comprobante.";
                        sunatStatus = returnMessage;
                    }
                }
            }

            if (isSuccess && (sunatStatus == "ACEPTADO" || sunatStatus == null)) 
            {
                if (result.RootElement.TryGetProperty("cdrResponse", out var cdrResponse))
                {
                    var desc = cdrResponse.TryGetProperty("description", out var d) ? d.GetString() : null;
                    sunatStatus = desc ?? "El comprobante ha sido aceptado";
                }
                else if (result.RootElement.TryGetProperty("sunatResponse", out var sunatRes) &&
                         sunatRes.TryGetProperty("cdrResponse", out var cdrRes))
                {
                    sunatStatus = cdrRes.TryGetProperty("description", out var d) ? d.GetString() : "ACEPTADO";
                }
                else
                {
                    sunatStatus = "ACEPTADO";
                }
            }

            return (isSuccess, returnMessage, xmlUrl, pdfUrl, cdrUrl, sunatStatus, hashString);
        }
        catch (Exception ex)
        {
            return (false, $"Excepción al emitir comprobante: {ex.Message}", null, null, null, "ERROR", null);
        }
    }

    // Helper para convertir monto a texto (leyenda 1000 obligatoria en UBL 2.1)
    private string NumeroALetras(decimal monto)
    {
        var entero = Math.Truncate(monto);
        var decimales = Math.Round((monto - entero) * 100, 0);
        return $"{entero} CON {decimales:00}/100";
    }
}