using ELearningPlatform.Api.Models;

namespace ELearningPlatform.Api.Services.Interfaces;

public interface ITokenService
{
    string CreateToken(User user);
}
