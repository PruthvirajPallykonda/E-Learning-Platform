import { useState } from 'react'
import { useDispatch } from "react-redux"
import { createCourse } from "./courseSlice"
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/BackButton'

function CreateCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        thumbnailUrl: "",
        categoryId: 1,
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.name === "categoryId" || e.target.name === "price" ? Number(e.target.value) : e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!form.title.trim() || !form.description.trim()) {
            setMessage("Course title and description are required.");
            return;
        }

        if (form.price === "" || Number(form.price) < 0) {
            setMessage("Enter a valid course price.");
            return;
        }

        const result = await dispatch(createCourse(form));

        if (createCourse.fulfilled.match(result)) {
            navigate("/instructor/dashboard", {
            state: {
                message: "Course created successfully."
            }
        });
        } else {
            setMessage(result.payload || result.error?.message || "Failed to create course.");
        }
    };
  return (
    <div className='container mt-4'>
        <BackButton fallback="/instructor/dashboard" />
        <h2>Create Course</h2>
        {message && <div className='alert alert-danger'>{message}</div>}

        <form onSubmit={handleSubmit}>
            <input 
                className='form-control mb-2'
                name='title'
                placeholder='Course title'
                value={form.title}
                onChange={handleChange}
            />

            <textarea 
                className='form-control mb-2'
                name='description'
                placeholder='Course description'
                value={form.description}
                onChange={handleChange}
            />

            <input 
                className='form-control mb-2'
                name='price'
                type='number'
                placeholder='Price'
                value={form.price}
                onChange={handleChange}
            />

            <input 
                className='form-control mb-2'
                name='thumbnailUrl'
                placeholder='Thumbnail URL'
                value={form.thumbnailUrl}
                onChange={handleChange}
            />

            <select
                className='form-control mb-2'
                name='categoryId'
                value={form.categoryId}
                onChange={handleChange}
            >
                <option value={1}>Web Development</option>
                <option value={2}>Backend Development</option>
                <option value={3}>Frontend Development</option>
                <option value={4}>Database</option>
            </select>
            <button className='btn btn-primary'>Create Course</button>
        </form>  
    </div>
  );
}

export default CreateCourse

