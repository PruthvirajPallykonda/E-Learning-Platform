import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchQuizzesByCourse } from "./quizSlice";

function QuizList({ courseId }) {
    const dispatch = useDispatch();

    const { quizzes, loading, error } = useSelector(
        (state) => state.quizzes
    );

    useEffect(() => {
        if (courseId) {
            dispatch(fetchQuizzesByCourse(courseId));
        }
    }, [dispatch, courseId]);

    if (loading) {
        return <p className="mt-4">Loading quizzes...</p>;
    }

    if (error) {
        return (
            <div className="alert alert-danger mt-4">
                {error}
            </div>
        );
    }

    if (quizzes.length === 0) {
        return <p className="mt-4">No quizzes available.</p>;
    }

    return (
        <div className="mt-4">
            <h4>Quizzes</h4>

            {quizzes.map((quiz) => (
                <div
                    className="border rounded mb-2 p-3"
                    key={quiz.id}
                >
                    <h6>{quiz.title}</h6>

                    <p>{quiz.questionCount} questions</p>

                    <Link
                        to={`/quizzes/${quiz.id}`}
                        className="btn btn-sm btn-primary"
                    >
                        Start Quiz
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default QuizList;