namespace ELearningPlatform.Api.Models;

public class Enrollment
{
    public int Id { get; set; }

    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }

    public User? User { get; set; }

    public int CourseId { get; set; }

    public Course? Course { get; set; }
}
