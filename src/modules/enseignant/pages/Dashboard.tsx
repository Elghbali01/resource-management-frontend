// src/modules/enseignant/pages/Dashboard.tsx
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

export default function EnseignantDashboard() {
  const { nom, prenom } = useAuth();

  return (
    <DashboardLayout
      role="ENSEIGNANT"
      nom={nom}
      prenom={prenom}
      navItems={[
        { label: "Dashboard", path: "/enseignant", icon: "📊" },
        { label: "Pannes", path: "/enseignant/pannes", icon: "🔧" },
      ]}
    >
      <h1>Enseignant Dashboard</h1>
    </DashboardLayout>
  );
}
