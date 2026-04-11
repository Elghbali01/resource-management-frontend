// src/modules/chef/pages/Dashboard.tsx
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

export default function ChefDashboard() {
  const { nom, prenom } = useAuth();

  return (
    <DashboardLayout
      role="CHEF_DEPARTEMENT"
      nom={nom}
      prenom={prenom}
      navItems={[
        { label: "Dashboard", path: "/chef", icon: "📊" },
        { label: "Besoins", path: "/chef/besoins", icon: "📦" },
      ]}
    >
      <h1>Chef Dashboard</h1>
    </DashboardLayout>
  );
}
