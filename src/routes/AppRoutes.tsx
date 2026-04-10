import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import AdminDashboard from "../pages/dashboards/AdminDashboard";
import ChefDashboard from "../pages/dashboards/ChefDashboard";
import EnseignantDashboard from "../pages/dashboards/EnseignantDashboard";
import ResponsableDashboard from "../pages/dashboards/ResponsableDashboard";
import FournisseurDashboard from "../pages/dashboards/FournisseurDashboard";
import TechnicienDashboard from "../pages/dashboards/TechnicienDashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/chef" element={<ChefDashboard />} />
        <Route path="/enseignant" element={<EnseignantDashboard />} />
        <Route path="/responsable" element={<ResponsableDashboard />} />
        <Route path="/fournisseur" element={<FournisseurDashboard />} />
        <Route path="/technicien" element={<TechnicienDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
