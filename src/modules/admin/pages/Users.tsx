// src/modules/admin/pages/Users.tsx
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
        { label: "Users", path: "../pages", icon: "👥" },
      ]}
    >
      <h2>Gestion des utilisateurs</h2>
    </DashboardLayout>
  );
}
