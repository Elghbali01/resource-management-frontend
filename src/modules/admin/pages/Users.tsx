import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

export default function UsersPage() {
  const { nom, prenom } = useAuth();

  return (
    <DashboardLayout
      role="ADMIN"
      nom={nom}
      prenom={prenom}
      navItems={[
        { label: "Dashboard", path: "/admin", icon: "📊" },
        { label: "Users", path: "/admin/users", icon: "👥" },
      ]}
    >
      <h2>Gestion des utilisateurs</h2>
    </DashboardLayout>
  );
}