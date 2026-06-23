namespace SaaS.API.Services;

public interface IUserContext
{
    string? UserId { get; }
    string? EmpresaId { get; }
    string? Role { get; }
    bool HasPermission(string permission);
}
