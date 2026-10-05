import { useEffect, useState } from "react";
import { createQuizApi } from "../../api/quizApi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyInstructorCourses } from "../courses/courseSlice";
import BackButton from "../../components/BackButton";

function CreateQuiz() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { instructorCourses } = useSelector((state) => state.courses);
  
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    courseIds: [],
    questions: [
      {
        questionText: "",
        options: [
          { optionText: "", isCorrect: true },
          { optionText: "", isCorrect: false },
        ],
      },
    ],
  });

  useEffect(() => {
    dispatch(fetchMyInstructorCourses());
  }, [dispatch]);

  const updateQuestionText = (index, value) => {
    const questions = [...form.questions];
    questions[index].questionText = value;
    setForm({ ...form, questions });
  };

  const updateOptionText = (questionIndex, optionIndex, value) => {
    const questions = [...form.questions];
    questions[questionIndex].options[optionIndex].optionText = value;
    setForm({ ...form, questions });
  };

  const setCorrectOption = (questionIndex, optionIndex) => {
    const questions = [...form.questions];

    questions[questionIndex].options = questions[questionIndex].options.map(
      (option, index) => ({
        ...option,
        isCorrect: index === optionIndex,
      })
    );

    setForm({ ...form, questions });
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          questionText: "",
          options: [
            { optionText: "", isCorrect: true },
            { optionText: "", isCorrect: false },
          ],
        },
      ],
    });
  };

  const removeQuestion = (questionIndex) => {
    if (form.questions.length === 1) {
      setMessage("Quiz must have at least one question.");
      return;
    }

    setForm({
      ...form,
      questions: form.questions.filter((_, index) => index !== questionIndex),
    });
  };

  const toggleCourse = (courseId) => {
    const isSelected = form.courseIds.includes(courseId);

    setForm({
      ...form,
      courseIds: isSelected
        ? form.courseIds.filter((id) => id !== courseId)
        : [...form.courseIds, courseId],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.title.trim()) {
      setMessage("Quiz title is required.");
      return;
    }

    if (form.courseIds.length === 0) {
      setMessage("Select at least one course for this quiz.");
      return;
    }

    const hasInvalidQuestion = form.questions.some(
      (question) =>
        !question.questionText.trim() ||
        question.options.some((option) => !option.optionText.trim())
    );

    if (hasInvalidQuestion) {
      setMessage("Every question and option must have text.");
      return;
    }

    try {
    await createQuizApi(form);

    navigate("/instructor/dashboard", {
        state: {
            message: "Quiz created successfully."
        }
    });
    } catch (error) {
        setMessage(
            error.response?.data || "Failed to create quiz."
        );
    }
  };

  return (
    <div className="container mt-4">
      <BackButton fallback="/instructor/dashboard" />
      <h2>Create Quiz</h2>

      {message && (
      <div className="alert alert-danger">
        {message}
      </div>
    )}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Quiz title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <div className="border rounded p-3 mb-3">
          <h5>Add this quiz to these courses</h5>
          {instructorCourses.length === 0 && (
            <p className="text-muted mb-0">Create a course before adding quizzes.</p>
          )}
          {instructorCourses.map((course) => (
            <div className="form-check" key={course.id}>
              <input
                className="form-check-input"
                id={`quiz-course-${course.id}`}
                type="checkbox"
                checked={form.courseIds.includes(course.id)}
                onChange={() => toggleCourse(course.id)}
              />
              <label className="form-check-label" htmlFor={`quiz-course-${course.id}`}>
                {course.title}
              </label>
            </div>
          ))}
        </div>

        {form.questions.map((question, questionIndex) => (
          <div className="card mb-3" key={questionIndex}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Question {questionIndex + 1}</h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeQuestion(questionIndex)}
                  aria-label={`Remove question ${questionIndex + 1}`}
                  title="Remove question"
                >
                  x
                </button>
              </div>
              <input
                className="form-control mb-2"
                placeholder={`Question ${questionIndex + 1}`}
                value={question.questionText}
                onChange={(e) =>
                  updateQuestionText(questionIndex, e.target.value)
                }
              />

              {question.options.map((option, optionIndex) => (
                <div className="input-group mb-2" key={optionIndex}>
                  <div className="input-group-text">
                    <input
                      type="radio"
                      checked={option.isCorrect}
                      onChange={() =>
                        setCorrectOption(questionIndex, optionIndex)
                      }
                    />
                  </div>

                  <input
                    className="form-control"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option.optionText}
                    onChange={(e) =>
                      updateOptionText(
                        questionIndex,
                        optionIndex,
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={addQuestion}
        >
          Add Question
        </button>

        <button className="btn btn-warning" disabled={instructorCourses.length === 0}>
          Create Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;
