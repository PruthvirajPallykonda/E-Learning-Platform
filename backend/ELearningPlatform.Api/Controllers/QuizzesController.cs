using ELearningPlatform.Api.Data;
using ELearningPlatform.Api.DTOs.Quizzes;
using ELearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.AccessControl;
using System.Security.Claims;

namespace ELearningPlatform.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizzesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuizzesController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Instructor,Admin")]
        [HttpPost]

        public async Task<IActionResult> CreateQuiz(QuizCreateDto request)
        {
            var instructorId = GetCurrentUserId();

            if (string.IsNullOrWhiteSpace(request.Title))
            {
                return BadRequest("Quiz title is required.");
            }

            var courseIds = request.CourseIds.Count > 0
                ? request.CourseIds.Distinct().ToList()
                : request.CourseId > 0
                    ? new List<int> { request.CourseId }
                    : new List<int>();

            if (courseIds.Count == 0)
            {
                return BadRequest("Select at least one course for this quiz.");
            }

            var courses = await _context.Courses
                .Where(c => courseIds.Contains(c.Id))
                .ToListAsync();

            if (courses.Count != courseIds.Count)
            {
                return NotFound("One or more selected courses were not found.");
            }

            if (!User.IsInRole("Admin") && courses.Any(course => course.InstructorId != instructorId))
            {
                return Forbid();
            }

            if(request.Questions.Count == 0)
            {
                return BadRequest("Quiz must have at least one question.");
            }

            foreach (var question in request.Questions)
            {
                if (string.IsNullOrWhiteSpace(question.QuestionText))
                {
                    return BadRequest("Each question must include text.");
                }

                if(question.Options.Count < 2)
                {
                    return BadRequest("Each question must have at least two options.");
                }

                if (question.Options.Any(o => string.IsNullOrWhiteSpace(o.OptionText)))
                {
                    return BadRequest("Each option must include text.");
                }

                var correctOptionCount = question.Options.Count(o => o.IsCorrect);

                if(correctOptionCount != 1)
                {
                    return BadRequest("Each question must have exactly one correct option.");
                }
            }

            var quizzes = courses.Select(course => new Quiz
            {
                Title = request.Title,
                CourseId = course.Id,
                Questions = request.Questions.Select(q => new Question
                {
                    QuestionText = q.QuestionText.Trim(),
                    Options = q.Options.Select(o => new Option
                    {
                        OptionText = o.OptionText.Trim(),
                        IsCorrect = o.IsCorrect,
                    }).ToList()

                }).ToList()
            }).ToList();

            _context.Quizzes.AddRange(quizzes);
            await _context.SaveChangesAsync();

            return Ok(quizzes.Select(quiz => new
                {
                    quiz.Id,
                    quiz.Title,
                    quiz.CourseId,
                    QuestionCount = quiz.Questions.Count,
                })
                .ToList());
        }

        [Authorize]
        [HttpGet("course/{courseId}")]
        
        public async Task<ActionResult<List<QuizListDto>>> GetQuizzessByCourse(int courseId)
        {
            var quizzes = await _context.Quizzes
                .Include(q => q.Course)
                .Include(q => q.Questions)
                .Where(q =>  q.CourseId == courseId)
                .Select(q => new  QuizListDto
                {
                    Id = q.Id,
                    Title = q.Title,
                    CourseId = courseId,
                    CourseTitle = q.Course!.Title,
                    QuestionCount = q.Questions.Count,

                }).ToArrayAsync();

            return Ok(quizzes);
        }

        [Authorize(Roles = "Student")]
        [HttpGet("{quizId}")]

        public async Task<ActionResult<QuizDetailsDto>> GetQuizById(int quizId)
        {
            var userId = GetCurrentUserId();

            var quiz = await _context.Quizzes
                .Include(q => q.Course)
                .Include(q => q.Questions)
                    .ThenInclude(question => question.Options)
                .FirstOrDefaultAsync(q => q.Id == quizId);

            if(quiz == null)
            {
                return NotFound("Quiz not found");
            }

            var isEnrolled = await _context.Enrollments
                .AnyAsync(e => e.UserId == userId && e.CourseId == quiz.CourseId);

            if(!isEnrolled)
            {
                return Forbid();
            }
            var result = new QuizDetailsDto
            {
                Id = quizId,
                Title = quiz.Title,
                CourseId = quiz.CourseId,
                CourseTitle = quiz.Course!.Title,
                Questions = quiz.Questions.Select(q => new QuestionDto
                {
                    Id = q.Id,
                    QuestionText = q.QuestionText,
                    Options = q.Options.Select(o => new OptionDto
                    {
                        Id = o.Id,
                        OptionText = o.OptionText,
                    }).ToList()
                }).ToList()
            };

            return Ok(result);
        }

        [Authorize(Roles = "Student")]
        [HttpPost("{quizId}/submit")]

        public async Task<ActionResult<QuizResultDto>> SubmitQuiz(int quizId, QuizSubmitDto request)
        {
            var userId = GetCurrentUserId();
            
            var quiz = await _context.Quizzes
                .Include(q => q.Course)
                .Include(q => q.Questions)
                    .ThenInclude(question => question.Options)
                .FirstOrDefaultAsync(q => q.Id == quizId);

            if(quiz == null)
            {
                return NotFound("Quiz not found");
            }

            var isEnrolled = await _context.Enrollments
                .AnyAsync(e => e.UserId == userId && e.CourseId == quiz.CourseId);

            if (!isEnrolled)
            {
                return Forbid();
            }

            var totalQuestions = quiz.Questions.Count();

            if(request.Answers.Count != totalQuestions)
            {
                return BadRequest("You must answer all questions");
            }

            var score = 0;

            foreach(var answer in request.Answers)
            {
                var question = quiz.Questions
                    .FirstOrDefault(q => q.Id == answer.QuestionId);

                if(question == null)
                {
                    return BadRequest("Invalid question");
                }

                var selectedOption = question.Options
                    .FirstOrDefault(o => o.Id == answer.SelectedOptionId);

                if(selectedOption == null)
                {
                    return BadRequest("Invalid selected option");
                }    
                
                if(selectedOption.IsCorrect)
                {
                    score++;
                }

            }

            var quizResult = new QuizResult
            {
                UserId = userId,
                QuizId = quizId,
                Score = score,
                TotalQuestions = totalQuestions,
                SubmittedAt = DateTime.Now,
            };

            _context.QuizResults.Add(quizResult);
            await _context.SaveChangesAsync();

            var percentage = totalQuestions == 0 ? 0 : Math.Round((double)score / totalQuestions * 100, 2);

            return Ok(new QuizResultDto
            {
                QuizResultId = quizResult.Id,
                QuizId = quiz.Id,
                QuizTitle = quiz.Title,
                CourseId = quiz.CourseId,
                CourseTitle = quiz.Course!.Title,
                Score = score,
                TotalQuestions = totalQuestions,
                Percentage = percentage,
                SubmittedAt = quizResult.SubmittedAt,
            });
        }

        [Authorize(Roles = "Student")]
        [HttpGet("results/my-results")]

        public async Task<ActionResult<List<QuizResultDto>>> GetMyResults()
        {
            var userId = GetCurrentUserId();

            var results = await _context.QuizResults
                .Include(qr => qr.Quiz)
                    .ThenInclude(q => q!.Course)
                .Where(qr => qr.UserId == userId)
                .OrderByDescending(qr => qr.SubmittedAt)
                .Select(qr => new QuizResultDto
                {
                    QuizResultId = qr.Id,
                    QuizId = qr.QuizId,
                    QuizTitle = qr.Quiz!.Title,
                    CourseId = qr.Quiz.CourseId,
                    CourseTitle = qr.Quiz.Course!.Title,
                    Score = qr.Score,
                    TotalQuestions = qr.TotalQuestions,
                    Percentage = qr.TotalQuestions == 0 ? 0 : Math.Round((double)qr.Score / qr.TotalQuestions * 100, 2),
                    SubmittedAt = qr.SubmittedAt,
                }).ToListAsync();

            return Ok(results);
        }

        private int GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            return int.Parse(userId!);
        }
    }
}
