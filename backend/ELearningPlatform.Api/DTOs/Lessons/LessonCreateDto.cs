namespace ELearningPlatform.Api.DTOs.Lessons
{
    public class LessonCreateDto
    {
        public string Title { get; set; } = string.Empty;

        public string? VideoUrl { get; set; }

        public int OrderNumber { get; set; }

        public int CourseId { get; set; }
    }
}
