using ELearningPlatform.Api.Data;
using ELearningPlatform.Api.DTOs.Lessons;
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
    public class LessonController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LessonController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("course/{courseId}")]

        public async Task<ActionResult<LessonListDto>> GetLessonByCourse(int courseId)
        {
            var userId = GetCurrentUserId();

            var lessons = await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .OrderBy(l => l.OrderNumber)
                .Select(l => new LessonListDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    OrderNumber = l.OrderNumber,
                    IsCompleted = l.LessonProgresses.Any(lp => lp.UserId == userId && lp.IsCompleted)
                })
                .ToListAsync();
            return Ok(lessons);
        }

        [Authorize(Roles = "Student")]
        [HttpGet("{lessonId}")]

        public async Task<ActionResult<LessonDetailsDto>> GetLessonById(int lessonId)
        {
            var userId = GetCurrentUserId();

            var lesson = await _context.Lessons
                .Include(l => l.Course)
                .Include(l => l.LessonProgresses)
                .Where(l => l.Id == lessonId)
                .Select(l => new LessonDetailsDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    VideoUrl = l.VideoUrl,
                    OrderNumber = l.OrderNumber,
                    CourseId = l.CourseId,
                    CourseTitle = l.Course!.Title,
                    IsCompleted = l.LessonProgresses.Any(lp => lp.UserId == userId && lp.IsCompleted)
                }).FirstOrDefaultAsync();

            if (lesson == null)
            {
                return NotFound("Lesson not found");
            }

            var isEnrolled = await _context.Enrollments
                .AnyAsync(e => e.UserId == userId && e.CourseId == lesson.CourseId);

            if (!isEnrolled)
            {
                return Forbid();
            }

            return Ok(lesson);
        }

        [Authorize(Roles = "Instructor")]
        [HttpPost]
        public async Task<IActionResult> CreateLesson(LessonCreateDto request)
        {
            var instructorId = GetCurrentUserId();

            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == request.CourseId);

            if (course == null)
            {
                return NotFound("Course not found");
            }

            if (course.InstructorId != instructorId)
            {
                return Forbid();
            }

            var orderExitsts = await _context.Lessons
                .AnyAsync(l => l.CourseId == request.CourseId &&
                                l.OrderNumber == request.OrderNumber);

            if (orderExitsts)
            {
                return BadRequest("Lesson ordernumber already exits for this course");
            }

            var lesson = new Lesson
            {
                Title = request.Title,
                VideoUrl = request.VideoUrl,
                OrderNumber = request.OrderNumber,
                CourseId = request.CourseId,
            };

            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                lesson.Id,
                lesson.Title,
                lesson.VideoUrl,
                lesson.OrderNumber,
                lesson.CourseId
            });
        }

        [Authorize(Roles = "Instructor")]
        [HttpPut("{lessonId}")]

        public async Task<IActionResult> UpdateLesson(int lessonId, LessonUpdateDto request)
        {
            var instructorId = GetCurrentUserId();

            var lesson = await _context.Lessons
                .Include(l => l.Course)
                .FirstOrDefaultAsync(l => l.Id == lessonId);

            if (lesson == null)
            {
                return NotFound("Lesson not found");
            }

            if (lesson.Course!.InstructorId != instructorId)
            {
                return Forbid();
            }

            var orderExits = await _context.Lessons
                .AnyAsync(l => l.CourseId == lesson.CourseId && 
                                l.OrderNumber == lesson.OrderNumber &&
                                l.Id != lessonId);

            if(orderExits)
            {
                return BadRequest("Lesson order number already exits for this course.");
            }
            
            lesson.Title = request.Title;
            lesson.VideoUrl = request.VideoUrl;
            lesson.OrderNumber = request.OrderNumber;

            await _context.SaveChangesAsync();

            return NoContent();

        }

        [Authorize(Roles = "Instructor")]
        [HttpDelete("{lessonId}")]

        public async Task<IActionResult> DeleteLesson(int lessonId)
        {
            var instructorId = GetCurrentUserId();

            var lesson = await _context.Lessons
                .Include(l => l.Course)
                .FirstOrDefaultAsync(l => l.Id == lessonId);

            if (lesson == null)
            {
                return NotFound("Lesson not found");
            }

            if (lesson.Course!.InstructorId == instructorId)
            {
                return Forbid();
            }

            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private int GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return int.Parse(userId!);
        }
    }
}
