// src/components/AuthGuard.jsx
import { Navigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const isLoggedIn = !!localStorage.getItem("techcafe_user"); // Adjust this based on your auth logic

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}