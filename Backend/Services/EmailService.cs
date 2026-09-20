using System;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace SaaS.API.Services;

public interface IEmailService
{
    Task SendClientVerificationEmailAsync(string toEmail, string clientName, string verificationToken);
    Task SendVerificationEmailAsync(string toEmail, string verificationToken);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public Task SendVerificationEmailAsync(string toEmail, string verificationToken)
    {
        return SendClientVerificationEmailAsync(toEmail, "Distinguido Cliente", verificationToken);
    }

    public async Task SendClientVerificationEmailAsync(string toEmail, string clientName, string verificationToken)
    {
        var smtpConfig = _config.GetSection("SmtpSettings");
        var host = smtpConfig["Host"];
        var port = int.Parse(smtpConfig["Port"] ?? "587");
        var email = smtpConfig["Email"];
        var password = smtpConfig["Password"];
        var enableSsl = bool.Parse(smtpConfig["EnableSsl"] ?? "true");

        if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            // Si no hay configuración SMTP cargada en .env, no bloqueamos el flujo de registro
            return;
        }

        // Asegurar que la URL nunca esté vacía ni sea localhost por accidente
        var rawStoreUrl = _config["StorefrontUrl"];
        var storeBaseUrl = string.IsNullOrWhiteSpace(rawStoreUrl) ? "https://lgant.vercel.app" : rawStoreUrl;
        var verificationLink = $"{storeBaseUrl.TrimEnd('/')}/verificar-correo?token={verificationToken}";

        using var client = new SmtpClient(host, port)
        {
            Credentials = new NetworkCredential(email, password),
            EnableSsl = enableSsl
        };

        var displayName = string.IsNullOrWhiteSpace(clientName) ? "Estimado/a cliente" : clientName;

        var mailMessage = new MailMessage
        {
            From = new MailAddress(email, "L'gant Tienda Oficial"),
            Subject = "Confirma tu cuenta - L'gant",
            Body = $@"
                <div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;'>
                    <h2 style='color: #1a1a1a; margin-top: 0;'>Hola, {displayName}</h2>
                    <p style='font-size: 15px; line-height: 1.5;'>
                        Gracias por registrarte en L'gant. Para completar la creación de tu cuenta y poder iniciar sesión, por favor confirma tu dirección de correo haciendo clic en el siguiente botón:
                    </p>
                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='{verificationLink}' style='background-color: #d4af37; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;'>
                            Confirmar mi correo
                        </a>
                    </div>
                    <p style='color: #666; font-size: 13px; line-height: 1.5;'>
                        Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
                        <a href='{verificationLink}' style='color: #d4af37; word-break: break-all;'>{verificationLink}</a>
                    </p>
                    <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;' />
                    <p style='color: #999; font-size: 12px; margin: 0;'>
                        © {DateTime.UtcNow.Year} L'gant. Todos los derechos reservados.
                    </p>
                </div>
            ",
            IsBodyHtml = true
        };
        mailMessage.To.Add(toEmail);

        try
        {
            await client.SendMailAsync(mailMessage);
        }
        catch
        {
            // Silencioso para no romper el registro si el servidor SMTP aún no está activo
        }
    }
}
