import { useState } from 'react'
import { createLessonApi } from "../../api/lessonApi"
import { useNavigate } from 'react-router-dom'

function CreateLesson() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        videoUrl: "",
        orderNumber: 1,
        courseId: 1,
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
            e.target.name === "orderNumber" || e.target.name === "courseId" ? Number(e.target.value) : e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createLessonApi(form);
            navigate("/instructor/dashboard");
        } catch {
            setMessage("Failed to create lesson");
        }
    }

  return (
    <div className='container mt-4'>
        <h2>Add Lesson</h2>

        {message && <p className='text-danger'>{message}</p>}

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

            <input 
                className='form-control mb-2'
                name='courseId'
                type='number'
                placeholder='Course ID'
                value={form.courseId}
                onChange={handleChange}
            />
            <button className='btn btn-success'>Add Lesson</button>
        </form>
      
    </div>
  );
}

export default CreateLesson
