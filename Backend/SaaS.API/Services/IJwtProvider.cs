using SaaS.API.Models;

namespace SaaS.API.Services;

public interface IJwtProvider
{
    string GenerateToken(User user);
}
