namespace ELearningPlatform.Api.DTOs.Courses
{
    public class CourseCreateDto
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string? ThumbnailUrl { get; set; }

        public int CategoryId { get; set; }
    }
}
