namespace ELearningPlatform.Api.Models;

public class Lesson
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? VideoUrl { get; set; }

    public int OrderNumber { get; set; }

    public int CourseId { get; set; }

    public Course? Course { get; set; }

    public ICollection<LessonProgress> LessonProgresses { get; set; } = new List<LessonProgress>();
}
