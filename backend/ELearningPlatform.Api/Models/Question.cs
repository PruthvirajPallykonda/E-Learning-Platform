namespace ELearningPlatform.Api.Models;

public class Question
{
    public int Id { get; set; }

    public string QuestionText { get; set; } = string.Empty;

    public int QuizId { get; set; }

    public Quiz? Quiz { get; set; }

    public ICollection<Option> Options { get; set; } = new List<Option>();
}
