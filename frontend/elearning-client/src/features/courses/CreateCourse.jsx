import { useState } from 'react'
import { useDispatch } from "react-redux"
import { createCourse } from "./courseSlice"
import { useNavigate } from 'react-router-dom'

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

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.name === "categoryId" || e.target.name === "price" ? Number(e.target.value) : e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(createCourse(form));

        if (createCourse.fulfilled.match(result)) {
            navigate("/instructor/dashboard");
        }
    };
  return (
    <div className='container mt-4'>
        <h2>Create Course</h2>

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

