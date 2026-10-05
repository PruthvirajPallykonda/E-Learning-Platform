import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteAdminCourseApi,
  deleteAdminLessonApi,
  deleteAdminQuizApi,
  deleteAdminUserApi,
  getAdminCoursesApi,
  getAdminUsersApi,
} from "../api/adminApi";

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    setError("");

    try {
      const [coursesResponse, usersResponse] = await Promise.all([
        getAdminCoursesApi(),
        getAdminUsersApi(),
      ]);

      setCourses(coursesResponse.data);
      setUsers(usersResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const runDelete = async (confirmText, deleteAction, successText) => {
    if (!window.confirm(confirmText)) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await deleteAction();
      setMessage(successText);
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data || "Delete failed.");
    }
  };

  const studentsAndInstructors = users.filter((user) => user.role !== "Admin");

  return (
    <div className="container mt-4 admin-dashboard">
      <span className="eyebrow">Admin</span>
      <h2>Admin Dashboard</h2>
      <p>Manage the platform, review learning content, and jump into instructor tools.</p>

      <div className="admin-grid">
        <div className="admin-card">
          <strong>Courses</strong>
          <span>Review public courses and seeded demo content.</span>
          <Link className="btn btn-primary" to="/courses">View Courses</Link>
        </div>

        <div className="admin-card">
          <strong>Create Course</strong>
          <span>Add a new course using instructor tools.</span>
          <Link className="btn btn-success" to="/instructor/courses/create">Create Course</Link>
        </div>

        <div className="admin-card">
          <strong>Add Lesson</strong>
          <span>Create lesson entries for an existing course.</span>
          <Link className="btn btn-outline-primary" to="/instructor/lessons/create">Add Lesson</Link>
        </div>

        <div className="admin-card">
          <strong>Create Quiz</strong>
          <span>Build quizzes for enrolled students.</span>
          <Link className="btn btn-warning" to="/instructor/quizzes/create">Create Quiz</Link>
        </div>
      </div>

      {message && <div className="alert alert-success mt-4">{message}</div>}
      {error && <div className="alert alert-danger mt-4">{error}</div>}
      {loading && <p className="mt-4">Loading admin data...</p>}

      {!loading && (
        <>
          <section className="admin-section">
            <div className="section-header">
              <h4>Manage Courses</h4>
              <p>Delete courses, individual lessons, or quizzes from one place.</p>
            </div>

            {courses.length === 0 && <p>No courses available.</p>}

            <div className="admin-management-list">
              {courses.map((course) => (
                <div className="admin-management-card" key={course.id}>
                  <div className="admin-management-header">
                    <div>
                      <h5>{course.title}</h5>
                      <p>Instructor: {course.instructorName}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        runDelete(
                          `Delete course "${course.title}" and all its lessons, quizzes, enrollments, and progress?`,
                          () => deleteAdminCourseApi(course.id),
                          "Course deleted successfully."
                        )
                      }
                    >
                      Delete Course
                    </button>
                  </div>

                  <div className="admin-nested-grid">
                    <div>
                      <h6>Lessons</h6>
                      {course.lessons.length === 0 && <p>No lessons.</p>}
                      {course.lessons.map((lesson) => (
                        <div className="admin-row" key={lesson.id}>
                          <span>
                            {lesson.orderNumber}. {lesson.title}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              runDelete(
                                `Delete lesson "${lesson.title}"?`,
                                () => deleteAdminLessonApi(lesson.id),
                                "Lesson deleted successfully."
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h6>Quizzes</h6>
                      {course.quizzes.length === 0 && <p>No quizzes.</p>}
                      {course.quizzes.map((quiz) => (
                        <div className="admin-row" key={quiz.id}>
                          <span>
                            {quiz.title} ({quiz.questionCount} questions)
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              runDelete(
                                `Delete quiz "${quiz.title}" and its results?`,
                                () => deleteAdminQuizApi(quiz.id),
                                "Quiz deleted successfully."
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-section">
            <div className="section-header">
              <h4>Manage Users</h4>
              <p>Delete student and instructor accounts when needed.</p>
            </div>

            {studentsAndInstructors.length === 0 && (
              <p>No students or instructors available.</p>
            )}

            <div className="admin-user-list">
              {studentsAndInstructors.map((user) => (
                <div className="admin-row" key={user.id}>
                  <span>
                    <strong>{user.fullName}</strong> ({user.role}) - {user.email}
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      runDelete(
                        `Delete ${user.role.toLowerCase()} "${user.fullName}"?`,
                        () => deleteAdminUserApi(user.id),
                        "User deleted successfully."
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
