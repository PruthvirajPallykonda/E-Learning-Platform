namespace ELearningPlatform.Api.DTOs.Quizzes
{
    public class QuestionCreateDto
    {
        public string QuestionText { get; set; } = string.Empty;

        public List<OptionCreateDto> Options { get; set; } = new();
    }
}
