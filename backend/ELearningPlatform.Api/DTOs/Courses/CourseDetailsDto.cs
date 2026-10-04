namespace ELearningPlatform.Api.DTOs.Courses
{
    public class CourseDetailsDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string? ThumbnailUrl { get; set; }

        public string CategoryName { get; set; } = string.Empty;

        public string InstructorName { get; set; } = string.Empty;

        public List<LessonInfoDto> Lessons { get; set; } = new();
    }

    public class LessonInfoDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public int OrderNumber { get; set; }
    }
}
