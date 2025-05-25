// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext.js"

export default function ProtectedRoute({ children, role }) {
  const { user } = useUser();

  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
