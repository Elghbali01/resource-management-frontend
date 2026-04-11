// src/modules/responsable/pages/Dashboard.tsx
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

export default function ResponsableDashboard() {
  const { nom, prenom } = useAuth();

  return (
    <DashboardLayout
      role="RESPONSABLE_RESOURCE"
      nom={nom}
      prenom={prenom}
      navItems={[
        { label: "Dashboard", path: "/responsable", icon: "📊" },
        { label: "Offres", path: "/responsable/offres", icon: "📋" },
      ]}
    >
      <h1>Responsable Dashboard</h1>
    </DashboardLayout>
  );
}
