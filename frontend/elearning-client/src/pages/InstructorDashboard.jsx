import {Link} from 'react-router-dom'

function InstructorDashboard() {
  return (
    <div className='container mt-4'>
        <h2>Instructor Dashboard</h2>

        <div className='d-flex gap-2 mt-3'>
            <Link to="/instructor/courses/create" className='btn btn-primary'>
                Create Course
            </Link>

            <Link to="/instructor/lessons/create" className='btn btn-success'>
                Add Lesson
            </Link>

            <Link to="/instructor/quizzes/create" className='btn btn-warning'>
                Create Quiz
            </Link>
        </div>
    </div>
  )
}

export default InstructorDashboard
