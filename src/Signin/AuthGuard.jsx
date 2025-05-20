// src/components/AuthGuard.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthGuard({ children }) {
  const user = useSelector((state) => state.user.currentUser);

  if (!user || !user.github_id) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
