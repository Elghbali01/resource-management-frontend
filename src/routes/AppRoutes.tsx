import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Auth pages ────────────────────────────────────────────────────────────────
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// ── User pages ────────────────────────────────────────────────────────────────
import AdminPage from "../pages/user/AdminPage";
import ChefPage from "../pages/user/ChefPage";
import EnseignantPage from "../pages/user/EnseignantPage";
import ResponsablePage from "../pages/user/ResponsablePage";
import FournisseurPage from "../pages/user/FournisseurPage";
import TechnicienPage from "../pages/user/TechnicienPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirection racine */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards par rôle */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/chef" element={<ChefPage />} />
        <Route path="/enseignant" element={<EnseignantPage />} />
        <Route path="/responsable" element={<ResponsablePage />} />
        <Route path="/fournisseur" element={<FournisseurPage />} />
        <Route path="/technicien" element={<TechnicienPage />} />
      </Routes>
    </BrowserRouter>
  );
}
