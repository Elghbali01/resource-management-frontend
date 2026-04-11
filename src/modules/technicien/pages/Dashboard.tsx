// src/modules/technicien/pages/Dashboard.tsx
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

export default function TechnicienDashboard() {
  const { nom, prenom } = useAuth();

  return (
    <DashboardLayout
      role="TECHNICIEN"
      nom={nom}
      prenom={prenom}
      navItems={[
        { label: "Dashboard", path: "/technicien", icon: "📊" },
        {
          label: "Interventions",
          path: "/technicien/interventions",
          icon: "🔧",
        },
      ]}
    >
      <h1>Technicien Dashboard</h1>
    </DashboardLayout>
  );
}
