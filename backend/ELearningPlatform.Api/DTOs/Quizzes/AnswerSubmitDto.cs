namespace ELearningPlatform.Api.DTOs.Quizzes
{
    public class AnswerSubmitDto
    {
        public int QuestionId { get; set; }

        public int SelectedOptionId { get; set; }
    }
}
