import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../features/auth/authSlice"

function Navbar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
            <Link className="navbar-brand" to="/">
                E-Learning
            </Link>

            <div className="navbar-nav ms-auto">
                <Link className="nav-link" to="/courses">
                    Courses
                </Link>

                {!user && (
                    <>
                        <Link className="nav-link" to="/login">Login</Link>
                        <Link className="nav-link" to="/register">Register</Link>
                    </>
                )}

                {user?.role === "Student" && (
                    <Link className="nav-link" to="/student/dashboard">Student Dashboard</Link>
                )}

                {user?.role === "Instructor" && (
                    <Link className="nav-link" to="/instructor/dashboard">Instructor Dashboard</Link>
                )}

                {user?.role === "Admin" && (
                    <Link className="nav-link" to="/admin/dashboard">Admin Dashboard</Link>
                )}

                {user && (
                    <button className="btn btn-sm btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                )}
            </div>
        </div>
    </nav>
  );
}

export default Navbar
