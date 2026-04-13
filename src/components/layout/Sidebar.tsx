import { NavLink, useNavigate } from "react-router-dom";
import { clearSession } from "../../services/authService";
import "./Sidebar.css";

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

interface SidebarProps {
  role: string;
  nom: string;
  prenom: string;
  navItems: NavItem[];
  subTitle?: string;
}

const roleLabels: Record<string, string> = {
  ADMIN: "Administration",
  CHEF_DEPARTEMENT: "Chef de Département",
  ENSEIGNANT: "Enseignant",
  RESPONSABLE_RESOURCE: "Responsable Ressources",
  FOURNISSEUR: "Fournisseur",
  TECHNICIEN: "Technicien",
};

export default function Sidebar({ role, nom, prenom, navItems, subTitle }: SidebarProps) {
  const navigate = useNavigate();

  const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* ── Brand ── */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">🎓</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">GestRes</span>
          <span className="sidebar-brand-sub">{subTitle || roleLabels[role] || role}</span>
        </div>
      </div>

      {/* ── User info ── */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">{initials}</div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">
            {prenom} {nom}
          </span>
          <span className="sidebar-user-role">{roleLabels[role] ?? role}</span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">
        <span className="sidebar-nav-label">Navigation</span>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? " active" : ""}`
            }
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-text">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="sidebar-nav-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <button className="sidebar-logout" onClick={handleLogout}>
        <span>🚪</span>
        Déconnexion
      </button>
    </aside>
  );
}
