import { Navigate } from "react-router-dom";


const AuthGuard = ({ children }) => {
  const localUser = JSON.parse(localStorage.getItem("user"));
  const localToken = localStorage.getItem("token");

  if (localToken && localUser) {
    // check if token is expired
    if (localUser.expiresIn < new Date().getTime()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default AuthGuard;