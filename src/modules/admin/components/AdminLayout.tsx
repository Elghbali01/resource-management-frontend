import { Outlet } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: "📊" },
  { label: "Utilisateurs", path: "/admin/users", icon: "👥" },
  { label: "Départements", path: "/admin/departements", icon: "🏢" },
];

export default function AdminLayout() {
  const { nom, prenom } = useAuth();

  return (
    <DashboardLayout
      role="ADMIN"
      nom={nom}
      prenom={prenom}
      navItems={NAV_ITEMS}
    >
      <Outlet />
    </DashboardLayout>
  );
}
