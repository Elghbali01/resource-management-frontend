// src/modules/fournisseur/pages/Dashboard.tsx
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";

export default function FournisseurDashboard() {
  const { nom, prenom } = useAuth();

  return (
    <DashboardLayout
      role="FOURNISSEUR"
      nom={nom}
      prenom={prenom}
      navItems={[
        { label: "Dashboard", path: "/fournisseur", icon: "📊" },
        { label: "Offres", path: "/fournisseur/offres", icon: "📦" },
      ]}
    >
      <h1>Fournisseur Dashboard</h1>
    </DashboardLayout>
  );
}
