import {useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchQuizById, submitQuiz, clearLatestResult } from './quizSlice'
import { useParams } from 'react-router-dom'

function QuizPage() {
    const { quizId } =  useParams();
    const dispatch = useDispatch();

    const { selectedQuiz, latestResult } = useSelector((state) => state.quizzes);

    const [answers, setAnwers] = useState({});

    useEffect(() => {
        dispatch(clearLatestResult());
        dispatch(fetchQuizById(quizId));
    }, [dispatch, quizId]);
    
    const handleAnwerChange = (questionId, optionId) => {
        setAnwers({
            ...answers,
            [questionId]: optionId,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formattedAnswers = Object.keys(answers).map((questionId) => ({
            questionId: Number(questionId),
            selectedOptionId: answers[questionId],
        }));

        dispatch(
            submitQuiz({
                quizId,
                answers:formattedAnswers,
            })
        );
    };

    if(!selectedQuiz) {
        return <p className='container mt-4'>Loading quiz...</p>
    }

  return (
    <div className='container mt-4'>
        <h2>{selectedQuiz.title}</h2>
        <p>Course: {selectedQuiz.courseTitle}</p>

        {
            latestResult && (
            <div className='alert alert-success'>
                <h5>Quiz Submitted</h5>
                <p>
                    Score: {latestResult.score} / {latestResult.totalQuestions}
                </p>
                <p>Percentage: {latestResult.percentage}%</p>
            </div>
        )}

        <form onSubmit={handleSubmit}>
            {selectedQuiz.questions.map((question, index) => (
                <div className='card mb-3' key={question.id}>
                    <div className='card-body'>
                        <h5>
                            {index + 1}.{question.questionText}
                        </h5>
                        {question.options.map((option) => (
                            <div className='form-check' key={option.id}>
                                <input 
                                    className='form-check-input'
                                    type='radio'
                                    name={`question-${question.id}`}
                                    value={option.id}
                                    checked={answers[question.id] === option.id}
                                    onChange={() => handleAnwerChange(question.id, option.id)}
                                />
                                <label className='form-check-label'>
                                    {option.optionText}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <button className='btn btn-success' disabled={Object.keys(answers).length !== selectedQuiz.questions.length }>
                Submit Quiz
            </button>
        </form>
    </div>
  )
}

export default QuizPage
