// src/modules/admin/pages/Dashboard.tsx
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: "📊" },
  { label: "Users", path: "/admin/users", icon: "👥" },
];

export default function AdminDashboard() {
  const { nom, prenom } = useAuth();

  return (
    <DashboardLayout
      role="ADMIN"
      nom={nom}
      prenom={prenom}
      navItems={NAV_ITEMS}
    >
      <h1></h1>
    </DashboardLayout>
  );
}
