namespace ELearningPlatform.Api.Models;

public class QuizResult
{
    public int Id { get; set; }

    public int Score { get; set; }

    public int TotalQuestions { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }

    public User? User { get; set; }

    public int QuizId { get; set; }

    public Quiz? Quiz { get; set; }
}
