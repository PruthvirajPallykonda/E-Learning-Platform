import { Link } from "react-router-dom";

function AdminDashboard() {
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
    </div>
  );
}

export default AdminDashboard;
