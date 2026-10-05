import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { fetchMyInstructorCourses } from "../features/courses/courseSlice";

function InstructorDashboard() {

    const location = useLocation();
    const successMessage = location.state?.message;
    const dispatch = useDispatch();

    const { instructorCourses, loading } = useSelector(
        (state) => state.courses
    );

    useEffect(() => {
        dispatch(fetchMyInstructorCourses());
    }, [dispatch]);

    return (
        <div className="container mt-4">
            <h2>Instructor Dashboard</h2>
            {successMessage && (
            <div className="alert alert-success mt-3">
                {successMessage}
            </div>
            )}

            <div className="d-flex gap-2 mt-3 mb-4">
                <Link
                    to="/instructor/courses/create"
                    className="btn btn-primary"
                >
                    Create Course
                </Link>

                <Link
                    to="/instructor/lessons/create"
                    className="btn btn-success"
                >
                    Add Lesson
                </Link>

                <Link
                    to="/instructor/quizzes/create"
                    className="btn btn-warning"
                >
                    Create Quiz
                </Link>
            </div>

            <h4>My Courses</h4>

            {loading && <p>Loading courses...</p>}

            {!loading && instructorCourses.length === 0 && (
                <p>You have not created any courses yet.</p>
            )}

            <div className="row">
                {instructorCourses.map((course) => (
                    <div className="col-md-6 mb-4" key={course.id}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5>{course.title}</h5>

                                <p>{course.description}</p>

                                <p>
                                    <strong>Price:</strong> ₹{course.price}
                                </p>

                                <p>
                                    <strong>Created:</strong>{" "}
                                    {new Date(
                                        course.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <hr />

                                <h6>Lessons</h6>

                                {course.lessons.length === 0 ? (
                                    <p className="text-muted">
                                        No lessons added.
                                    </p>
                                ) : (
                                    <ul>
                                        {course.lessons.map((lesson) => (
                                            <li key={lesson.id}>
                                                {lesson.orderNumber}.{" "}
                                                {lesson.title}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <h6 className="mt-3">Quizzes</h6>

                                {course.quizzes.length === 0 ? (
                                    <p className="text-muted">
                                        No quizzes added.
                                    </p>
                                ) : (
                                    <ul>
                                        {course.quizzes.map((quiz) => (
                                            <li key={quiz.id}>
                                                {quiz.title} (
                                                {quiz.questionCount} questions)
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InstructorDashboard;