// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { getToken, getRole } from "../services/authService";

// Rôles pour lesquels le changement de MDP est obligatoire
const FORCED_ROLES = [
  "CHEF_DEPARTEMENT",
  "ENSEIGNANT",
  "RESPONSABLE_RESOURCE",
  "TECHNICIEN",
];

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const token = getToken();
  const userRole = getRole();
  const location = useLocation();

  if (!token) return <Navigate to="/login" />;

  if (role && userRole !== role) return <Navigate to="/login" />;

  // Blocage forcé si mustChangePassword=true (sauf ADMIN et FOURNISSEUR)
  const mustChange = localStorage.getItem("mustChangePassword") === "true";
  if (mustChange && FORCED_ROLES.includes(userRole ?? "")) {
    // Éviter la boucle infinie si déjà sur /change-password
    if (location.pathname !== "/change-password") {
      return <Navigate to="/change-password" replace />;
    }
  }

  return <>{children}</>;
}
