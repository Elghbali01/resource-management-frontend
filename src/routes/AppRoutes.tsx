import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../modules/admin/components/AdminLayout";
import StatistiquesPage from "../modules/admin/pages/StatistiquesPage";
import UsersPage from "../modules/admin/pages/UsersPage";
import DepartementsPage from "../modules/admin/pages/DepartementsPage";

import ChefDashboard from "../modules/chef/pages/Dashboard";
import EnseignantDashboard from "../modules/enseignant/pages/Dashboard";
import ResponsableDashboard from "../modules/responsable/pages/Dashboard";
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

        <Route
          path="/chef"
          element={
            <ProtectedRoute role="CHEF_DEPARTEMENT">
              <ChefDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/enseignant"
          element={
            <ProtectedRoute role="ENSEIGNANT">
              <EnseignantDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/responsable"
          element={
            <ProtectedRoute role="RESPONSABLE_RESOURCE">
              <ResponsableDashboard />
            </ProtectedRoute>
          }
        />

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
