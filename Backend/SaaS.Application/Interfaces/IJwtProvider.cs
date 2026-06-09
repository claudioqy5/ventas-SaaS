using SaaS.Domain.Entities;

namespace SaaS.Application.Interfaces;

public interface IJwtProvider
{
    string GenerateToken(User user);
}
