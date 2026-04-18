import { Outlet } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

export default function FournisseurLayout() {
  const { nom, prenom } = useAuth();

  const NAV_ITEMS = [
    { label: "Dashboard", path: "/fournisseur", icon: "📊" },
    { label: "Appels d'Offres", path: "/fournisseur/offres", icon: "📦" },
  ];

  return (
    <DashboardLayout
      role="FOURNISSEUR"
      nom={nom}
      prenom={prenom}
      navItems={NAV_ITEMS}
    >
      <Outlet />
    </DashboardLayout>
  );
}
