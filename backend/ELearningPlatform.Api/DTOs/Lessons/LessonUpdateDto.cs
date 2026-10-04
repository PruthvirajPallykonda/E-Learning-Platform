namespace ELearningPlatform.Api.DTOs.Lessons
{
    public class LessonUpdateDto
    {
        public string Title { get; set; } = string.Empty;

        public string? VideoUrl { get; set; }

        public int OrderNumber { get; set; }
    }
}
