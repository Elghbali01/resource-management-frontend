import { Outlet } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { useNotificationPolling } from "../../../hooks/useNotificationPolling";

export default function EnseignantLayout() {
  const { nom, prenom } = useAuth();
  const { count } = useNotificationPolling(true);

  const navItems = [
    { label: "Dashboard", path: "/enseignant", icon: "📊" },
    { label: "Pannes", path: "/enseignant/pannes", icon: "🔧" },
    {
      label: "Besoins & Notifs",
      path: "/enseignant/demandes",
      icon: "🔔",
      badge: count,
    },
  ];

  return (
    <DashboardLayout
      role="ENSEIGNANT"
      nom={nom}
      prenom={prenom}
      navItems={navItems}
      subTitle="Espace Enseignant"
    >
      <Outlet />
    </DashboardLayout>
  );
}
