import { Outlet } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

export default function TechnicienLayout() {
  const { nom, prenom } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/technicien", icon: "📊" },
    { label: "Interventions", path: "/technicien/interventions", icon: "🔧" },
  ];

  return (
    <DashboardLayout
      role="TECHNICIEN"
      nom={nom}
      prenom={prenom}
      navItems={navItems}
      subTitle="Espace Technicien"
    >
      <Outlet />
    </DashboardLayout>
  );
}
