namespace ELearningPlatform.Api.DTOs.Lessons
{
    public class LessonListDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public int OrderNumber { get; set; }

        public bool IsCompleted { get; set; }
    }
}
