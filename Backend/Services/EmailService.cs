using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace SaaS.API.Services;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string toEmail, string verificationToken);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendVerificationEmailAsync(string toEmail, string verificationToken)
    {
        var smtpConfig = _config.GetSection("SmtpSettings");
        var host = smtpConfig["Host"];
        var port = int.Parse(smtpConfig["Port"] ?? "587");
        var email = smtpConfig["Email"];
        var password = smtpConfig["Password"];
        var enableSsl = bool.Parse(smtpConfig["EnableSsl"] ?? "true");

        if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            // Si no hay configuración, no lanzamos error fatal pero logueamos (opcional). En producción esto debería estar configurado.
            return;
        }

        var verificationLink = $"http://localhost:5173/verificar-correo?token={verificationToken}";
        // En producción cambiar a la URL real
        if (_config["FrontendUrl"] != null)
        {
            verificationLink = $"{_config["FrontendUrl"].TrimEnd('/')}/verificar-correo?token={verificationToken}";
        }
        else 
        {
            verificationLink = $"https://ventassaas.vercel.app/verificar-correo?token={verificationToken}";
        }

        using var client = new SmtpClient(host, port)
        {
            Credentials = new NetworkCredential(email, password),
            EnableSsl = enableSsl
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(email, "SaaS Administración"),
            Subject = "Verifica tu cuenta - Bienvenido",
            Body = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #edf2f7; border-radius: 8px;'>
                    <h2 style='color: #2d3748;'>¡Bienvenido a nuestro sistema!</h2>
                    <p style='color: #4a5568; font-size: 16px;'>Para comenzar a utilizar tu cuenta, necesitamos que verifiques tu dirección de correo electrónico.</p>
                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='{verificationLink}' style='background-color: #a3c4f3; color: #1e3a8a; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;'>Verificar mi cuenta</a>
                    </div>
                    <p style='color: #718096; font-size: 14px;'>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
                    <p style='color: #718096; font-size: 12px; word-break: break-all;'>{verificationLink}</p>
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
            // Loguear error de correo si falla (credenciales invalidas, etc)
            // Se silencia para no romper el flujo de registro si el correo rebota
        }
    }
}
