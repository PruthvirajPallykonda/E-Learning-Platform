namespace ELearningPlatform.Api.DTOs.Progress
{
    public class ProgressUpdateDto
    {
        public int CourseId { get; set; }

        public int LessonId { get; set; }

        public int TotalLessons { get; set; }

        public int CompletedLessons { get; set; }

        public double ProgressPercentage { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
