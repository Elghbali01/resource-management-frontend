import { Outlet } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

export default function ResponsableLayout() {
  const { nom, prenom } = useAuth();

  const NAV_ITEMS = [
    { label: "Dashboard", path: "/responsable", icon: "📊" },
    { label: "Demandes Transmises", path: "/responsable/demandes", icon: "📁" },
    { label: "Offres", path: "/responsable/offres", icon: "📋" },
  ];

  return (
    <DashboardLayout
      role="RESPONSABLE_RESOURCE"
      nom={nom}
      prenom={prenom}
      navItems={NAV_ITEMS}
    >
      <Outlet />
    </DashboardLayout>
  );
}
