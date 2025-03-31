import { Navigate } from "react-router-dom";

const UsernameProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token) {
    return <Navigate to="/sign-in" />;
  }

  if (username) {
    return <Navigate to="/events" />;
  }

  return children;
};

export default UsernameProtectedRoute;