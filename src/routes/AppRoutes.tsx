import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
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
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin — toutes les sous-routes affichent AdminPage (tab géré en interne) */}
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/chef/*" element={<ChefPage />} />
        <Route path="/enseignant/*" element={<EnseignantPage />} />
        <Route path="/responsable/*" element={<ResponsablePage />} />
        <Route path="/fournisseur/*" element={<FournisseurPage />} />
        <Route path="/technicien/*" element={<TechnicienPage />} />
      </Routes>
    </BrowserRouter>
  );
}
