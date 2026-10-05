namespace ELearningPlatform.Api.DTOs.Courses
{
    public class InstructorCourseDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<InstructorLessonDto> Lessons { get; set; } = new();

        public List<InstructorQuizDto> Quizzes { get; set; } = new();
    }

    public class InstructorLessonDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public int OrderNumber { get; set; }
    }

    public class InstructorQuizDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public int QuestionCount { get; set; }
    }
}