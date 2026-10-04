import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchQuizzesByCourse } from './quizSlice'
import { Link } from 'react-router-dom'

function QuizList({ courseId }) {
    const dispatch = useDispatch();
    const { quizzes } = useSelector((state) => state.quizzes);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchQuizzesByCourse(courseId));
        }
    }, [dispatch, courseId]);

    if(quizzes.length === 0) {
        return <p>No quizzes available.</p>;
    }
  return (
    <div className='mt-4'>
        <h4>Quizzes</h4>

        {quizzes.map((quiz) => (
            <div className='border rounded mb-2 ' key={quiz.id}>
                <h6>{quiz.title}</h6>
                <p>{quiz.questionCount} questions</p>

                <Link to={`/quizzes/${quiz.id}`} className='btn btn-sm btn-primary'>
                    Start quiz
                </Link>
            </div>
        ))}
    </div>
  );
}

export default QuizList;


