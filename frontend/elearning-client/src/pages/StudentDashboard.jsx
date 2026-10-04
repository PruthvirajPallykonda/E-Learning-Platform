import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyCourses } from "../features/courses/courseSlice";
import { Link } from "react-router-dom";
import MyQuizResults from "../features/quizzes/MyQuizResults";

function StudentDashboard() {
  const dispatch = useDispatch();

  const { myCourses } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h2>My Courses</h2>

      {myCourses.length === 0 && <p>You are not enrolled in any courses.</p>}

      <div className="row">
        {myCourses.map((item) => (
          <div className="col-md-4 mb-3" key={item.enrollmentId}>
            <div className="card h-100">
              <div className="card-body">
                <h5>{item.courseTitle}</h5>
                <p>Instructor: {item.instructorName}</p>
                <p>
                  Enrolled:{" "}
                  {new Date(item.enrolledAt).toLocaleDateString()}
                </p>

                <Link
                  to={`/courses/${item.courseId}`}
                  className="btn btn-primary"
                >
                  Continue Learning
                </Link>
                <MyQuizResults />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;
