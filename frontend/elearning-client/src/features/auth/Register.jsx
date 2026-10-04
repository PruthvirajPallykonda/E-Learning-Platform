import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from './authSlice'
import { useNavigate } from 'react-router-dom'

function PasswordIcon({ visible }) {
    if (visible) {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
                <path d="m3 3 18 18" />
            </svg>
        );
    }

    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "Student",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(register(form));

        if(register.fulfilled.match(result))
        {
            navigate("/login");
        }
    }
  return (
    <div className='auth-page container mb-4'>
      <div className='auth-card'>
        <span className='eyebrow'>Create account</span>
        <h2>Register</h2>
        <p className='auth-copy'>Join as a student or instructor and start using the platform.</p>
        {error && <p className='text-danger'>{error}</p>}

        <form onSubmit={handleSubmit}>
            <input 
                className='form-control mb-3'
                name='fullName'
                placeholder='Full Name'
                value={form.fullName}
                onChange={handleChange}
            />

            <input 
                className='form-control mb-3'
                name='email'
                placeholder='Email'
                value={form.email}
                onChange={handleChange}
            />

            <div className='input-group password-field mb-3'>
              <input 
                  className='form-control'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  value={form.password}
                  onChange={handleChange}
              />
              <button
                className='btn btn-outline-secondary password-toggle'
                type='button'
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <PasswordIcon visible={showPassword} />
              </button>
            </div>

            <select 
                className='form-control mb-3'  
                name='role'
                value={form.role}
                onChange={handleChange}  
            >
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
            </select>
            <button className='btn btn-success w-100' disabled={loading}>
                {loading ? "Creating account..." : "Register"}
            </button>
        </form>
      </div>
    </div>
  )
}


export default Register
