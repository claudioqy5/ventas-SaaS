namespace SaaS.Application.Interfaces;

public interface IUserContext
{
    string? UserId { get; }
    string? EmpresaId { get; }
    string? Role { get; }
    bool HasPermission(string permission);
}
