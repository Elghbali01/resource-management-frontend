import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

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
import ResponsableLayout from "../modules/responsable/components/ResponsableLayout";
import ResponsableDashboard from "../modules/responsable/pages/Dashboard";
import DemandesTransmisesPage from "../modules/responsable/pages/DemandesTransmisesPage";
import FournisseurDashboard from "../modules/fournisseur/pages/Dashboard";
import TechnicienDashboard from "../modules/technicien/pages/Dashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
        </Route>

        <Route
          path="/fournisseur"
          element={
            <ProtectedRoute role="FOURNISSEUR">
              <FournisseurDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technicien"
          element={
            <ProtectedRoute role="TECHNICIEN">
              <TechnicienDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
