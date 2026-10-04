namespace ELearningPlatform.Api.DTOs.Quizzes
{
    public class QuestionDto
    {
        public int Id { get; set; }

        public string QuestionText { get; set; } = string.Empty;

        public List<OptionDto> Options { get; set; } = new();
    }
}
