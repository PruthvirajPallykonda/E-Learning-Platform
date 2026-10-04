using ELearningPlatform.Api.Data;
using ELearningPlatform.Api.DTOs.Auth;
using ELearningPlatform.Api.Models;
using ELearningPlatform.Api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ELearningPlatform.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]

        public async Task<ActionResult<AuthResponseDto>> Resgister(RegisterDto request)
        {
            var emailExits = await _context.Users
                .AnyAsync(u => u.Email == request.Email);

            if (emailExits)
            {
                return BadRequest("Email already exists");
            }

            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == request.Role);

            if (role == null)
            {
                return BadRequest("Invalid role");
            }

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                RoleId = role.Id
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();


            user.Role = role;
            var token = _tokenService.CreateToken(user);

            return Ok(new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = role.Name,
                Token = token
            });
        }

        [HttpPost("login")]

        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto request)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if(user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if(!isPasswordValid)
            {
                return Unauthorized("Invalid email or password");
            }

            var token = _tokenService.CreateToken(user);

            return Ok(new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role!.Name,
                Token = token
            });
        }

    }
}
