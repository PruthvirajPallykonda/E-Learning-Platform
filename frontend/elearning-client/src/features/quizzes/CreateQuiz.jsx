import { useState } from "react";
import { createQuizApi } from "../../api/quizApi";
import { useNavigate } from "react-router-dom";

function CreateQuiz() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    courseId: 1,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createQuizApi(form);
    navigate("/instructor/dashboard");
  };

  return (
    <div className="container mt-4">
      <h2>Create Quiz</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Quiz title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="form-control mb-3"
          type="number"
          placeholder="Course ID"
          value={form.courseId}
          onChange={(e) =>
            setForm({ ...form, courseId: Number(e.target.value) })
          }
        />

        {form.questions.map((question, questionIndex) => (
          <div className="card mb-3" key={questionIndex}>
            <div className="card-body">
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

        <button className="btn btn-warning">Create Quiz</button>
      </form>
    </div>
  );
}

export default CreateQuiz;