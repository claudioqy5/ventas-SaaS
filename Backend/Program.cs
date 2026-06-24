using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SaaS.API.Services;
using SaaS.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Registrar servicios en el contenedor de dependencias
builder.Services.AddControllers();

// Configurar politicas de acceso CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configurar el middleware de autenticacion con tokens JWT
var secretKey = builder.Configuration.GetValue<string>("JwtSettings:Secret") ?? "SuperSecretSaaSKeyOfLengthGreaterThan32Characters!12345";
var issuer = builder.Configuration.GetValue<string>("JwtSettings:Issuer") ?? "SaaSProvider";
var audience = builder.Configuration.GetValue<string>("JwtSettings:Audience") ?? "SaaSClients";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// Registrar la infraestructura principal y servicios personalizados de la API
builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
builder.Services.AddSingleton<IJwtProvider, JwtProvider>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserContext, UserContext>();

// Configurar herramientas de Swagger para documentacion de API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurar el pipeline de solicitudes HTTP (Middlewares)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
