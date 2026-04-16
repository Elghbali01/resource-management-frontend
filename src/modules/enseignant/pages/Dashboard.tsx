// src/modules/enseignant/pages/Dashboard.tsx
import { useAuth } from "../../../hooks/useAuth";

export default function EnseignantDashboard() {
  const { nom, prenom } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Enseignant Dashboard</h1>
    </div>
  );
}
