import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyQuizResults } from "./quizSlice";

function MyQuizResults() {
  const dispatch = useDispatch();
  const { myResults } = useSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchMyQuizResults());
  }, [dispatch]);

  return (
    <div className="mt-4">
      <h4>My Quiz Results</h4>

      {myResults.length === 0 && <p>No quiz results yet.</p>}

      {myResults.map((result) => (
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