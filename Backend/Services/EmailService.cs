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

        // URL base de la tienda online de relojes (Frontend-Relojes)
        var storeBaseUrl = _config["StorefrontUrl"] ?? _config["FrontendUrl"] ?? "http://localhost:3000";
        var verificationLink = $"{storeBaseUrl.TrimEnd('/')}/verificar-correo?token={verificationToken}";

        using var client = new SmtpClient(host, port)
        {
            Credentials = new NetworkCredential(email, password),
            EnableSsl = enableSsl
        };

        var displayName = string.IsNullOrWhiteSpace(clientName) ? "Estimado/a cliente" : clientName;

        var mailMessage = new MailMessage
        {
            From = new MailAddress(email, "L'GANT Haute Horlogerie"),
            Subject = "Verifica tu cuenta VIP - L'GANT Haute Horlogerie",
            Body = $@"
                <div style='background-color: #0b0b0c; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;'>
                    <div style='max-width: 560px; margin: 0 auto; background-color: #121214; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);'>
                        <div style='background: linear-gradient(135deg, #18181b 0%, #09090b 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2);'>
                            <div style='font-size: 11px; letter-spacing: 3px; color: #d4af37; text-transform: uppercase; margin-bottom: 8px; font-weight: 600;'>HAUTE HORLOGERIE</div>
                            <h1 style='color: #ffffff; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: 1px;'>L'GANT</h1>
                        </div>
                        <div style='padding: 36px 30px;'>
                            <h2 style='color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 16px; font-weight: 600;'>Bienvenido a nuestra exclusiva colección</h2>
                            <p style='color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 24px;'>
                                Estimado/a <strong style='color: #f4f4f5;'>{displayName}</strong>,<br/>
                                Gracias por registrarte como cliente distinguido en <strong>L'GANT</strong>. Para activar tu cuenta VIP y acceder a tus pedidos exclusivos, por favor confirma tu dirección de correo electrónico haciendo clic en el siguiente botón:
                            </p>
                            <div style='text-align: center; margin: 32px 0;'>
                                <a href='{verificationLink}' style='display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #0b0b0c; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);'>
                                    Activar mi Cuenta VIP
                                </a>
                            </div>
                            <p style='color: #71717a; font-size: 13px; line-height: 1.5; margin-bottom: 10px;'>
                                Si tienes problemas con el botón, copia y pega el siguiente enlace en tu navegador:
                            </p>
                            <p style='color: #d4af37; font-size: 12px; word-break: break-all; margin: 0;'>
                                {verificationLink}
                            </p>
                        </div>
                        <div style='background-color: #09090b; padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); color: #52525b; font-size: 12px;'>
                            © {DateTime.UtcNow.Year} L'GANT Haute Horlogerie • Todos los derechos reservados.
                        </div>
                    </div>
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
