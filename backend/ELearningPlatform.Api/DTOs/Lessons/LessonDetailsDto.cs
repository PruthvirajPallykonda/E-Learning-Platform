namespace ELearningPlatform.Api.DTOs.Lessons
{
    public class LessonDetailsDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? VideoUrl { get; set; }

        public int OrderNumber { get; set; }

        public int CourseId { get; set; }

        public string CourseTitle { get; set; } = string.Empty;

        public bool IsCompleted { get; set; }
    }
}
