// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../services/authService";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const token = getToken();
  const userRole = getRole();

  if (!token) return <Navigate to="/login" />;

  if (role && userRole !== role) return <Navigate to="/login" />;

  return <>{children}</>;
}
