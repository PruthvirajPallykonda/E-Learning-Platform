namespace ELearningPlatform.Api.DTOs.Enrollments
{
    public class EnrolledCourseDto
    {
        public int EnrollmentId { get; set; }

        public int CourseId { get; set; }

        public string CourseTitle { get; set; } = string.Empty;

        public string InstructorName { get; set; } = string.Empty;

        public DateTime EnrolledAt { get; set; }

        public int TotalLessons { get; set; }

        public int CompletedLessons { get; set; }

        public double ProgressPercentage { get; set; }
    }
}