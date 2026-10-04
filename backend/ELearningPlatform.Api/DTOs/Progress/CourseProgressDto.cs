namespace ELearningPlatform.Api.DTOs.Progress
{
    public class CourseProgressDto
    {
        public int CourseId { get; set; }

        public string CourseTitle { get; set; } = string.Empty;

        public int TotalLessons { get; set; }

        public int CompletedLessons { get; set; }

        public double ProgressPercentage { get; set; }
    }
}
