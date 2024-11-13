import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // const { isAuthenticated, user } = useSelector((state) => state.auth);
  const localUser = JSON.parse(localStorage.getItem("user"));
  const localToken = localStorage.getItem("token");

  if (!localToken || !allowedRoles.includes(localUser?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;