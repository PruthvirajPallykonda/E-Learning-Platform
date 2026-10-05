namespace ELearningPlatform.Api.DTOs.Quizzes
{
    public class QuizCreateDto
    {
        public string Title { get; set; } = string.Empty;

        public int CourseId { get; set; }

        public List<int> CourseIds { get; set; } = new();

        public List<QuestionCreateDto> Questions { get; set; } = new();
    }
}
