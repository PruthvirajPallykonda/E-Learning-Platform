import { useSelector } from "react-redux";

function MyQuizResults({ courseId }) {
  const { myResults } = useSelector((state) => state.quizzes);
  const courseResults = myResults.filter(
    (result) => Number(result.courseId) === Number(courseId)
  );

  return (
    <div className="mt-4">
      <h4>My Quiz Results</h4>

      {courseResults.length === 0 && <p>No quiz results for this course yet.</p>}

      {courseResults.map((result) => (
        <div className="border rounded p-3 mb-2" key={result.quizResultId}>
          <h6>{result.quizTitle}</h6>
          <p>
            Score: {result.score} / {result.totalQuestions}
          </p>
          <p>Percentage: {result.percentage}%</p>
          <small>
            Submitted: {new Date(result.submittedAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default MyQuizResults;
