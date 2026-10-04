namespace ELearningPlatform.Api.DTOs.Quizzes
{
    public class OptionCreateDto
    {
        public string OptionText { get; set; } = string.Empty;

        public bool IsCorrect { get; set; }
    }
}
