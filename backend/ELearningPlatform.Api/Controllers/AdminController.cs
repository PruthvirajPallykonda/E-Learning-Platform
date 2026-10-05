using System.Security.Claims;
using ELearningPlatform.Api.Data;
using ELearningPlatform.Api.DTOs.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ELearningPlatform.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("courses")]
        public async Task<ActionResult<List<AdminCourseDto>>> GetCourses()
        {
            var courses = await _context.Courses
                .Include(course => course.Instructor)
                .OrderByDescending(course => course.CreatedAt)
                .Select(course => new AdminCourseDto
                {
                    Id = course.Id,
                    Title = course.Title,
                    InstructorName = course.Instructor!.FullName,
                    Lessons = course.Lessons
                        .OrderBy(lesson => lesson.OrderNumber)
                        .Select(lesson => new AdminLessonDto
                        {
                            Id = lesson.Id,
                            Title = lesson.Title,
                            OrderNumber = lesson.OrderNumber
                        })
                        .ToList(),
                    Quizzes = course.Quizzes
                        .Select(quiz => new AdminQuizDto
                        {
                            Id = quiz.Id,
                            Title = quiz.Title,
                            QuestionCount = quiz.Questions.Count()
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(courses);
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<AdminUserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Include(user => user.Role)
                .OrderBy(user => user.Role!.Name)
                .ThenBy(user => user.FullName)
                .Select(user => new AdminUserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role!.Name
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpDelete("courses/{courseId}")]
        public async Task<IActionResult> DeleteCourse(int courseId)
        {
            var deleted = await RemoveCourseAsync(courseId);

            if (!deleted)
            {
                return NotFound("Course not found.");
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("lessons/{lessonId}")]
        public async Task<IActionResult> DeleteLesson(int lessonId)
        {
            var lesson = await _context.Lessons.FirstOrDefaultAsync(l => l.Id == lessonId);

            if (lesson == null)
            {
                return NotFound("Lesson not found.");
            }

            var progress = await _context.LessonProgresses
                .Where(lp => lp.LessonId == lessonId)
                .ToListAsync();

            _context.LessonProgresses.RemoveRange(progress);
            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("quizzes/{quizId}")]
        public async Task<IActionResult> DeleteQuiz(int quizId)
        {
            var deleted = await RemoveQuizAsync(quizId);

            if (!deleted)
            {
                return NotFound("Quiz not found.");
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var currentUserId = GetCurrentUserId();

            if (userId == currentUserId)
            {
                return BadRequest("You cannot delete your own admin account.");
            }

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (user.Role?.Name == "Admin")
            {
                return BadRequest("Admin accounts cannot be deleted from this screen.");
            }

            var createdCourseIds = await _context.Courses
                .Where(course => course.InstructorId == userId)
                .Select(course => course.Id)
                .ToListAsync();

            foreach (var courseId in createdCourseIds)
            {
                await RemoveCourseAsync(courseId);
            }

            var enrollments = await _context.Enrollments
                .Where(enrollment => enrollment.UserId == userId)
                .ToListAsync();

            var lessonProgress = await _context.LessonProgresses
                .Where(progress => progress.UserId == userId)
                .ToListAsync();

            var quizResults = await _context.QuizResults
                .Where(result => result.UserId == userId)
                .ToListAsync();

            _context.Enrollments.RemoveRange(enrollments);
            _context.LessonProgresses.RemoveRange(lessonProgress);
            _context.QuizResults.RemoveRange(quizResults);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> RemoveCourseAsync(int courseId)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);

            if (course == null)
            {
                return false;
            }

            var lessonIds = await _context.Lessons
                .Where(lesson => lesson.CourseId == courseId)
                .Select(lesson => lesson.Id)
                .ToListAsync();

            var quizIds = await _context.Quizzes
                .Where(quiz => quiz.CourseId == courseId)
                .Select(quiz => quiz.Id)
                .ToListAsync();

            var progress = await _context.LessonProgresses
                .Where(lp => lessonIds.Contains(lp.LessonId))
                .ToListAsync();

            var lessons = await _context.Lessons
                .Where(lesson => lesson.CourseId == courseId)
                .ToListAsync();

            var enrollments = await _context.Enrollments
                .Where(enrollment => enrollment.CourseId == courseId)
                .ToListAsync();

            _context.LessonProgresses.RemoveRange(progress);
            _context.Lessons.RemoveRange(lessons);
            _context.Enrollments.RemoveRange(enrollments);

            foreach (var quizId in quizIds)
            {
                await RemoveQuizAsync(quizId);
            }

            _context.Courses.Remove(course);
            return true;
        }

        private async Task<bool> RemoveQuizAsync(int quizId)
        {
            var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz == null)
            {
                return false;
            }

            var questionIds = await _context.Questions
                .Where(question => question.QuizId == quizId)
                .Select(question => question.Id)
                .ToListAsync();

            var options = await _context.Options
                .Where(option => questionIds.Contains(option.QuestionId))
                .ToListAsync();

            var questions = await _context.Questions
                .Where(question => question.QuizId == quizId)
                .ToListAsync();

            var results = await _context.QuizResults
                .Where(result => result.QuizId == quizId)
                .ToListAsync();

            _context.Options.RemoveRange(options);
            _context.Questions.RemoveRange(questions);
            _context.QuizResults.RemoveRange(results);
            _context.Quizzes.Remove(quiz);

            return true;
        }

        private int GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(userId!);
        }
    }
}
