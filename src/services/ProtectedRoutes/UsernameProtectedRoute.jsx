import { Navigate } from "react-router-dom";

const UsernameProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token) {
    return <Navigate to="/sign-in" />; // Not logged in
  }

  if (username) {
    return <Navigate to="/events" />; // Already registered username, no need to access category
  }

  return children; // Can access category
};

export default UsernameProtectedRoute;