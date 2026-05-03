import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../modules/admin/components/AdminLayout";
import StatistiquesPage from "../modules/admin/pages/StatistiquesPage";
import UsersPage from "../modules/admin/pages/UsersPage";
import DepartementsPage from "../modules/admin/pages/DepartementsPage";

import ChefLayout from "../modules/chef/components/ChefLayout";
import ChefDashboard from "../modules/chef/pages/Dashboard";
import CollecteBesoinsPage from "../modules/chef/pages/CollecteBesoinsPage";

import EnseignantLayout from "../modules/enseignant/components/EnseignantLayout";
import EnseignantDashboard from "../modules/enseignant/pages/Dashboard";
import EnseignantDemandesPage from "../modules/enseignant/pages/EnseignantDemandesPage";
import EnseignantPannesPage from "../modules/enseignant/pages/EnseignantPannesPage";
import ResponsableLayout from "../modules/responsable/components/ResponsableLayout";
import ResponsableDashboard from "../modules/responsable/pages/Dashboard";
import DemandesTransmisesPage from "../modules/responsable/pages/DemandesTransmisesPage";
import AppelsOffrePage from "../modules/responsable/pages/AppelsOffrePage";
import FournisseursListPage from "../modules/responsable/pages/FournisseursListPage";
import InventairePage from "../modules/responsable/pages/InventairePage";
import AffectationsPage from "../modules/responsable/pages/AffectationsPage";
import MaintenancePage from "../modules/responsable/pages/MaintenancePage";
import FournisseurLayout from "../modules/fournisseur/components/FournisseurLayout";
import FournisseurDashboard from "../modules/fournisseur/pages/Dashboard";
import FournisseurAppelsOffrePage from "../modules/fournisseur/pages/FournisseurAppelsOffrePage";
import MesOffresPage from "../modules/fournisseur/pages/MesOffresPage";
import TechnicienLayout from "../modules/technicien/components/TechnicienLayout";
import TechnicienDashboard from "../modules/technicien/pages/Dashboard";
import InterventionsPage from "../modules/technicien/pages/InterventionsPage";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Route changement de mot de passe (accessible à tous les utilisateurs connectés) */}
        <Route path="/change-password" element={<ChangePasswordPage />} />

        {/* Administration Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Index route for /admin renders the dashboard/statistics */}
          <Route index element={<StatistiquesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="departements" element={<DepartementsPage />} />
        </Route>

        {/* Chef de Département Routes */}
        <Route
          path="/chef"
          element={
            <ProtectedRoute role="CHEF_DEPARTEMENT">
              <ChefLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ChefDashboard />} />
          <Route path="collecte" element={<CollecteBesoinsPage />} />
        </Route>

        <Route
          path="/enseignant"
          element={
            <ProtectedRoute role="ENSEIGNANT">
              <EnseignantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EnseignantDashboard />} />
          <Route path="demandes" element={<EnseignantDemandesPage />} />
          <Route path="pannes" element={<EnseignantPannesPage />} />
        </Route>

        <Route
          path="/responsable"
          element={
            <ProtectedRoute role="RESPONSABLE_RESOURCE">
              <ResponsableLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ResponsableDashboard />} />
          <Route path="demandes" element={<DemandesTransmisesPage />} />
          <Route path="offres" element={<AppelsOffrePage />} />
          <Route path="fournisseurs" element={<FournisseursListPage />} />
          <Route path="inventaire" element={<InventairePage />} />
          <Route path="affectations" element={<AffectationsPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
        </Route>

        <Route
          path="/fournisseur"
          element={
            <ProtectedRoute role="FOURNISSEUR">
              <FournisseurLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<FournisseurDashboard />} />
          <Route path="offres" element={<FournisseurAppelsOffrePage />} />
          <Route path="mes-offres" element={<MesOffresPage />} />
        </Route>

        <Route
          path="/technicien"
          element={
            <ProtectedRoute role="TECHNICIEN">
              <TechnicienLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TechnicienDashboard />} />
          <Route path="interventions" element={<InterventionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
