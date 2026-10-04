namespace ELearningPlatform.Api.DTOs.Quizzes
{
    public class QuizSubmitDto
    {
        public List<AnswerSubmitDto> Answers { get; set; } = new();
    }
}
