namespace ELearningPlatform.Api.DTOs.Quizzes
{
    public class QuizListDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public int CourseId { get; set; }

        public string CourseTitle { get; set; } = string.Empty;

        public int QuestionCount { get; set; }
    }
}
