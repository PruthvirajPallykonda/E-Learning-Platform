using ELearningPlatform.Api.Data;
using ELearningPlatform.Api.DTOs.Courses;
using ELearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ELearningPlatform.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CoursesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<CourseListDto>>> GetCourses()
        {
            var courses = await _context.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Include(c => c.Lessons)
                .Select(c => new CourseListDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Price = c.Price,
                    ThumbnailUrl = c.ThumbnailUrl,
                    CategoryName = c.Category!.Name,
                    InstructorName = c.Instructor!.FullName,
                    LessonCount = c.Lessons.Count()
                }).ToListAsync();
            return Ok(courses);
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<CourseDetailsDto>> GetCourseById(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Include(c => c.Lessons)
                .Where(c => c.Id == id)
                .Select(c => new CourseDetailsDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Price = c.Price,
                    ThumbnailUrl = c.ThumbnailUrl,
                    CategoryName = c.Category!.Name,
                    InstructorName = c.Instructor!.FullName,
                    Lessons = c.Lessons
                    .OrderBy(l => l.OrderNumber)
                    .Select(l => new LessonInfoDto
                    {
                        Id = l.Id,
                        Title = l.Title,
                        OrderNumber = l.OrderNumber
                    })
                    .ToList()
                }).FirstOrDefaultAsync();

            if(course == null)
            {
                return NotFound("Course not found");
            }
            return Ok(course);
        }

        [Authorize(Roles = "Instructor,Admin")]
        [HttpPost]

        public async Task<ActionResult<CourseListDto>> CreateCourse(CourseCreateDto request)
        {
            var instructorId = GetCurrentUserId();

            if (string.IsNullOrWhiteSpace(request.Title))
            {
                return BadRequest("Course title is required.");
            }

            if (string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest("Course description is required.");
            }

            if (request.Price < 0)
            {
                return BadRequest("Course price cannot be negative.");
            }

            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == request.CategoryId);

            if(!categoryExists)
            {
                return BadRequest("Invalid Category");
            }

            var course = new Course
            {
                Title = request.Title,
                Description= request.Description,
                Price= request.Price,
                ThumbnailUrl= request.ThumbnailUrl,
                CategoryId = request.CategoryId,
                InstructorId = instructorId,
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCourseById), new { id = course.Id }, new
            {
                course.Id,
                course.Title,
                course.Description,
                course.Price,
                course.ThumbnailUrl
            });
        }

        [Authorize(Roles = "Instructor,Admin")]
        [HttpPut("{id}")]
        
        public async Task<IActionResult> UpdateCourse(int id, CourseUpdateDto request)
        {
            var instructorId = GetCurrentUserId();
            
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == id);

            if(course == null)
            {
                return NotFound("Course not found");
            }

            if (!User.IsInRole("Admin") && course.InstructorId != instructorId)
            {
                return Forbid();
            }

            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == request.CategoryId);

            if(!categoryExists)
            {
                return BadRequest("Invalid category");
            }

            course.Title = request.Title;
            course.Description = request.Description;
            course.Price = request.Price;
            course.ThumbnailUrl = request.ThumbnailUrl;
            course.CategoryId = request.CategoryId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Instructor,Admin")]
        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteCourse(int id)
        {
            var instructorId = GetCurrentUserId();

            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == id);

            if(course == null)
            {
                return NotFound("Course not found");
            }
            if(!User.IsInRole("Admin") && course.InstructorId != instructorId)
            {
                return Forbid();
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [Authorize(Roles = "Instructor,Admin")]
        [HttpGet("my-courses")]
        public async Task<ActionResult<List<InstructorCourseDto>>> GetMyCourses()
        {
            var instructorId = GetCurrentUserId();
            var isAdmin = User.IsInRole("Admin");

            var courses = await _context.Courses
                .Where(c => isAdmin || c.InstructorId == instructorId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new InstructorCourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Price = c.Price,
                    CreatedAt = c.CreatedAt,

                    Lessons = c.Lessons
                        .OrderBy(l => l.OrderNumber)
                        .Select(l => new InstructorLessonDto
                        {
                            Id = l.Id,
                            Title = l.Title,
                            OrderNumber = l.OrderNumber
                        })
                        .ToList(),

                    Quizzes = c.Quizzes
                        .Select(q => new InstructorQuizDto
                        {
                            Id = q.Id,
                            Title = q.Title,
                            QuestionCount = q.Questions.Count()
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(courses);
        }


        private int GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(userId!);
        }
    }
}
