import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourseById, enrollCourse, fetchMyCourses, clearEnrollmentMessage } from './courseSlice'
import { Link, useParams } from 'react-router-dom'
import QuizList from "../quizzes/QuizList";
import BackButton from '../../components/BackButton';

function CourseDetails() {

    const { id } = useParams();
    const courseId = Number(id);
    const dispatch = useDispatch();

    const { selectedCourse, myCourses, enrolling, enrollmentMessage, error } = useSelector((state) => state.courses);
    const { user } = useSelector((state) => state.auth);
    const isEnrolled = myCourses.some((course) => course.courseId === courseId);
    
    useEffect(() => {
        dispatch(fetchCourseById(id));
        dispatch(clearEnrollmentMessage());

        if (user?.role === "Student") {
            dispatch(fetchMyCourses());
        }
    }, [dispatch, id, user?.role]);

    const handleEnroll = async () => {
        const result = await dispatch(enrollCourse(id));

        if (enrollCourse.fulfilled.match(result)) {
            dispatch(fetchMyCourses());
        }
    };

    if(!selectedCourse) return <p className='container mt-4'>Loading...</p>;

  return (
    <div className='container mt-4 course-detail-page'>
        <BackButton fallback="/courses" />
        <span className='eyebrow'>Course details</span>
        <h2>{selectedCourse.title}</h2>
        <p>{selectedCourse.description}</p>
        <div className='detail-meta'>
            <span>Instructor: {selectedCourse.instructorName}</span>
            <span>Category: {selectedCourse.categoryName}</span>
        </div>

        {error && <div className='alert alert-danger'>{error}</div>}
        {enrollmentMessage && <div className='alert alert-success'>{enrollmentMessage}</div>}

        {user?.role === "Student" && (
            <button className='btn btn-success mb-3' onClick={handleEnroll} disabled={enrolling || isEnrolled}>
                {isEnrolled ? "Enrolled" : enrolling ? "Enrolling..." : "Enroll to Start"}
            </button>
        )}

        {!user && <div className='alert alert-info'>Login as a student and enroll to open lessons.</div>}

        <h4>Lessons</h4>

        {selectedCourse.lessons?.length === 0 && <p>No lessons are available yet.</p>}

        {selectedCourse.lessons?.map((lesson) => (
            <div className='lesson-row border p-2 mb-2' key={lesson.id}>
                <span>
                    {lesson.orderNumber}. {lesson.title}
                </span>

                {user?.role === "Student" && isEnrolled && (
                    <Link to={`/lessons/${lesson.id}`} className='btn btn-sm btn-primary ms-3'>
                        Open
                    </Link>
                )}

                {user?.role === "Student" && !isEnrolled && (
                    <button className='btn btn-sm btn-outline-secondary ms-3' disabled>
                        Enroll to unlock
                    </button>
                )}
            </div>
        ))}

        {user?.role === "Student" && isEnrolled && <QuizList courseId={selectedCourse.id} />}
        {user?.role === "Student" && !isEnrolled && <p className='text-muted mt-3'>Quizzes unlock after enrollment.</p>}
        
    </div>
  )
}

export default CourseDetails
