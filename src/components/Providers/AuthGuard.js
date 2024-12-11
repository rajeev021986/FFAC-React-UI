import { Navigate } from "react-router-dom";


const AuthGuard = ({ children }) => {
  const localUser = JSON.parse(localStorage.getItem("user"));
  const localToken = localStorage.getItem("token");

  if (localToken && localUser) {
    // check if token is expired
    if (localUser.expiresIn < new Date().getTime()) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      <Navigate to="/" />;
    }
    else {
      return <Navigate to="/app" />;
    }
  }

  return children;
};

export default AuthGuard;