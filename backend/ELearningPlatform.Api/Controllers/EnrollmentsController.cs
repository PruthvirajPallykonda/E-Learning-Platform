using System.Security.Claims;
using ELearningPlatform.Api.Data;
using ELearningPlatform.Api.DTOs.Enrollments;
using ELearningPlatform.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ELearningPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Student")]
public class EnrollmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public EnrollmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("{courseId}")]
    public async Task<IActionResult> EnrollInCourse(int courseId)
    {
        var userId = GetCurrentUserId();

        var courseExists = await _context.Courses
            .AnyAsync(c => c.Id == courseId);

        if (!courseExists)
        {
            return NotFound("Course not found.");
        }

        var alreadyEnrolled = await _context.Enrollments
            .AnyAsync(e => e.UserId == userId && e.CourseId == courseId);

        if (alreadyEnrolled)
        {
            return BadRequest("You are already enrolled in this course.");
        }

        var enrollment = new Enrollment
        {
            UserId = userId,
            CourseId = courseId
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        return Ok("Enrolled successfully.");
    }

    [HttpGet("my-courses")]
    public async Task<ActionResult<List<EnrolledCourseDto>>> GetMyCourses()
    {
        var userId = GetCurrentUserId();

        var courses = await _context.Enrollments
            .Include(e => e.Course)
                .ThenInclude(c => c!.Instructor)
            .Where(e => e.UserId == userId)
            .Select(e => new EnrolledCourseDto
            {
                EnrollmentId = e.Id,
                CourseId = e.CourseId,
                CourseTitle = e.Course!.Title,
                InstructorName = e.Course.Instructor!.FullName,
                EnrolledAt = e.EnrolledAt
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
