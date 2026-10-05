namespace ELearningPlatform.Api.DTOs.Admin
{
    public class AdminCourseDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string InstructorName { get; set; } = string.Empty;

        public List<AdminLessonDto> Lessons { get; set; } = new();

        public List<AdminQuizDto> Quizzes { get; set; } = new();
    }

    public class AdminLessonDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public int OrderNumber { get; set; }
    }

    public class AdminQuizDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public int QuestionCount { get; set; }
    }
}
