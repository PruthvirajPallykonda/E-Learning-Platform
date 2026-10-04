import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RoleBasedRoute({ roles, children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleBasedRoute;