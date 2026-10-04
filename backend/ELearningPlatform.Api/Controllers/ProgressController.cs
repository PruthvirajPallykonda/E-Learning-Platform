using ELearningPlatform.Api.Data;
using ELearningPlatform.Api.DTOs.Progress;
using ELearningPlatform.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.AccessControl;
using System.Security.Claims;
using ELearningPlatform.Api.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;


namespace ELearningPlatform.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgressController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ProgressHub> _hubContext;

        public ProgressController(AppDbContext context, IHubContext<ProgressHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [Authorize(Roles = "Student")]
        [HttpPost("complete-lesson/{lessonId}")]

        public async Task<IActionResult> CompleteLesson(int lessonId)
        {
            var userId = GetCurrentUserId();

            var lesson = await _context.Lessons
                .Include(l => l.Course)
                .FirstOrDefaultAsync(l => l.Id == lessonId);

            if (lesson == null)
            {
                return NotFound("Lesson not found");
            }

            var isEnrolled = await _context.Enrollments
                .AnyAsync(e => e.UserId == userId && e.CourseId == lesson.CourseId);

            if(!isEnrolled)
            {
                return Forbid();
            }

            var progress = await _context.LessonProgresses
                .FirstOrDefaultAsync(lp => lp.UserId == userId && lp.LessonId == lessonId);

            if(progress == null)
            {
                progress = new LessonProgress
                {
                    UserId = userId,
                    LessonId = lessonId,
                    IsCompleted = true,
                    CompletedAt = DateTime.UtcNow
                };

                _context.LessonProgresses.Add(progress);
            }
            else
            {
                progress.IsCompleted = true;
                progress.CompletedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            var totalLessons = await _context.Lessons
                .CountAsync(l => l.CourseId == lesson.CourseId);

            var completedLessons = await _context.LessonProgresses
                .CountAsync(lp =>
                lp.UserId == userId &&
                lp.IsCompleted &&
                lp.Lesson!.CourseId == lesson.CourseId);

            var progressPercentage = totalLessons == 0 ? 0 : Math.Round((double)completedLessons / totalLessons * 100, 2);

            var progressUpdate = new ProgressUpdateDto
            {
                CourseId = lesson.CourseId,
                LessonId = lessonId,
                TotalLessons = totalLessons,
                CompletedLessons = completedLessons,
                ProgressPercentage = progressPercentage,
                UpdatedAt = DateTime.UtcNow
            };

            await _hubContext.Clients
                .Group($"course-{lesson.CourseId}")
                .SendAsync("ProgressUpdated", progressUpdate);

            return Ok(progressUpdate);
        }

        [Authorize(Roles = "Student")]
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetCourseProgress(int courseId)
        {
            var userId = GetCurrentUserId();
            
            var course = await _context.Courses
                .Include(c => c.Lessons)
                .FirstOrDefaultAsync(c => c.Id == courseId);

            if(course == null)
            {
                return NotFound("Course not found.");
            }

            var isEnrolled = await _context.Enrollments
                .AnyAsync(e => e.UserId == userId && e.CourseId == courseId);

            if(!isEnrolled)
            {
                return Forbid();
            }

            var totalLessons = course.Lessons.Count();

            var completedLessons = await _context.LessonProgresses
                .CountAsync(lp => lp.UserId == userId && lp.IsCompleted && course.Lessons.Select(l => l.Id).Contains(lp.LessonId));

            var progressPercentage = totalLessons == 0 ? 0 : Math.Round((double)completedLessons / totalLessons * 100, 2);

            return Ok(new CourseProgressDto
            {
                CourseId = course.Id,
                CourseTitle = course.Title,
                TotalLessons = totalLessons,
                CompletedLessons = completedLessons,
                ProgressPercentage = progressPercentage
            });
        }

        private int GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return int.Parse(userId!);
        }
    }
}
