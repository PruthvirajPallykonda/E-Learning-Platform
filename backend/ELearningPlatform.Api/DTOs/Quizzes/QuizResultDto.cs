namespace ELearningPlatform.Api.DTOs.Quizzes
{
    public class QuizResultDto
    {
        public int QuizResultId { get; set; }

        public int QuizId { get; set; }

        public string QuizTitle { get; set; } = string.Empty;

        public int Score { get; set; }

        public int TotalQuestions { get; set; }

        public double Percentage { get; set; }

        public DateTime SubmittedAt { get; set; }
    }
}
