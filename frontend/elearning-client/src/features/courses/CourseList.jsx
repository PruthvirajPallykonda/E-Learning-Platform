import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "./courseSlice";
import { Link } from "react-router-dom";
import BackButton from "../../components/BackButton";

const defaultCourses = [
    {
        id: "sample-react",
        title: "React Fundamentals",
        description: "Build reusable components, manage state, and create fast single-page apps.",
        instructorName: "Demo Instructor",
        price: 999,
        categoryName: "Frontend Development",
        lessonCount: 8,
        thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: "sample-aspnet",
        title: "ASP.NET Core Web API",
        description: "Create secure REST APIs with controllers, Entity Framework, JWT auth, and Swagger.",
        instructorName: "Demo Instructor",
        price: 1299,
        categoryName: "Backend Development",
        lessonCount: 10,
        thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: "sample-sql",
        title: "SQL Server Essentials",
        description: "Learn relational design, queries, joins, indexing, and practical database workflows.",
        instructorName: "Demo Instructor",
        price: 899,
        categoryName: "Database",
        lessonCount: 7,
        thumbnailUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: "sample-js",
        title: "Modern JavaScript",
        description: "Master ES modules, async code, arrays, objects, DOM basics, and clean syntax.",
        instructorName: "Demo Instructor",
        price: 799,
        categoryName: "Web Development",
        lessonCount: 9,
        thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: "sample-css",
        title: "Responsive CSS Design",
        description: "Design polished layouts with flexbox, grid, forms, cards, and responsive styling.",
        instructorName: "Demo Instructor",
        price: 699,
        categoryName: "Frontend Development",
        lessonCount: 6,
        thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: "sample-fullstack",
        title: "Full Stack Project Bootcamp",
        description: "Connect React, APIs, authentication, database models, and deployment basics.",
        instructorName: "Shanakar Instructor",
        price: 1499,
        categoryName: "Web Development",
        lessonCount: 12,
        thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    },
];

function CourseList() {
    
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.courses);
    const displayCourses = items.length > 0 ? items : defaultCourses;

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);


  return (
    <div className="courses-page container mt-4">
        <BackButton fallback="/" />
        <div className="section-header">
            <span className="eyebrow">Course catalog</span>
            <h2>Courses</h2>
            <p>Choose a course and continue with lessons, quizzes, and progress tracking.</p>
        </div>
        <div className="row">
            {displayCourses.map((course) => {
                const isSample = String(course.id).startsWith("sample-");

                return (
                <div className="col-md-4 mb-3" key={course.id}>
                    <div className="card course-card h-100">
                        <img 
                            src={course.thumbnailUrl || "https://via.placeholder.com/300x160"}
                            className="card-img-top"
                            alt={course.title}
                        />

                        <div className="card-body">
                            <span className="course-tag">{course.categoryName || "Course"}</span>
                            <h5>{course.title}</h5>
                            <p>{course.description}</p>
                            <p className="course-meta">Instructor: {course.instructorName}</p>
                            <div className="course-footer">
                                <strong>Rs. {course.price}</strong>
                                <span>{course.lessonCount || 0} lessons</span>
                            </div>

                            {isSample ? (
                                <button className="btn btn-outline-primary w-100" disabled>
                                    Demo Course
                                </button>
                            ) : (
                                <Link to={`/courses/${course.id}`} className="btn btn-primary w-100">
                                    View Course
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
      
    </div>
  );
}

export default CourseList
