import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='home-shell container mt-4'>
      <section className='home-hero'>
        <div>
          <span className='eyebrow'>Online learning platform</span>
          <h1>E-Learning Platform</h1>
          <p>Learn structured courses, complete lessons, track progress, and test your knowledge with quizzes.</p>
          <div className='hero-actions'>
            <Link className='btn btn-primary' to='/courses'>Browse Courses</Link>
            <Link className='btn btn-outline-primary' to='/register'>Create Account</Link>
          </div>
        </div>
        <div className='hero-panel'>
          <div>
            <strong>6</strong>
            <span>starter courses</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>self-paced access</span>
          </div>
          <div>
            <strong>Live</strong>
            <span>progress tracking</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
