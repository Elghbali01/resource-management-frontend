import { Outlet } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

export default function ChefLayout() {
  const { nom, prenom } = useAuth();

  const NAV_ITEMS = [
    { label: "Dashboard", path: "/chef", icon: "📊" },
    { label: "Appel aux Besoins", path: "/chef/appels", icon: "📢" },
    { label: "Concertation (Validation)", path: "/chef/concertation", icon: "📦" },
  ];

  return (
    <DashboardLayout
      role="CHEF_DEPARTEMENT"
      nom={nom}
      prenom={prenom}
      navItems={NAV_ITEMS}
    >
      <Outlet />
    </DashboardLayout>
  );
}
