import { useEffect, useState } from 'react'
import { createLessonApi } from "../../api/lessonApi"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyInstructorCourses } from '../courses/courseSlice'
import BackButton from '../../components/BackButton'

function CreateLesson() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { instructorCourses } = useSelector((state) => state.courses);

    const [form, setForm] = useState({
        title: "",
        videoUrl: "",
        orderNumber: 1,
        courseId: "",
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(fetchMyInstructorCourses());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]:
                name === "courseId"
                    ? value
                    : name === "orderNumber"
                        ? Number(value)
                        : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!form.title.trim() || !form.videoUrl.trim()) {
            setMessage("Lesson title and video URL are required.");
            return;
        }

        if (!form.courseId) {
            setMessage("Select a course for this lesson.");
            return;
        }

        if (Number(form.orderNumber) < 1) {
            setMessage("Order number must be at least 1.");
            return;
        }

        try {
            await createLessonApi({
                ...form,
                courseId: Number(form.courseId),
                orderNumber: Number(form.orderNumber),
            });
            navigate("/instructor/dashboard", {
            state: {
                message: "Lesson created successfully."
            }
        });
        } catch (error) {
            setMessage(error.response?.data || "Failed to create lesson");
        }
    }

  return (
    <div className='container mt-4'>
        <BackButton fallback="/instructor/dashboard" />
        <h2>Add Lesson</h2>

        {message && <div className='alert alert-danger'>{message}</div>}

        <form onSubmit={handleSubmit}>
            <input 
                className='form-control mb-2'
                name='title'
                placeholder='Lesson Title'
                value={form.title}
                onChange={handleChange}
            />

            <input 
                className='form-control mb-2'
                name='videoUrl'
                placeholder='Video URL'
                value={form.videoUrl}
                onChange={handleChange}
            />

            <input 
                className='form-control mb-2'
                name='orderNumber'
                type='number'
                placeholder='Order Number'
                value={form.orderNumber}
                onChange={handleChange}
            />

            <select
                className='form-control mb-2'
                name='courseId'
                value={form.courseId}
                onChange={handleChange}
            >
                <option value="">Select course</option>
                {instructorCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                        {course.title}
                    </option>
                ))}
            </select>
            <button className='btn btn-success' disabled={instructorCourses.length === 0}>
                Add Lesson
            </button>
        </form>
      
    </div>
  );
}

export default CreateLesson
