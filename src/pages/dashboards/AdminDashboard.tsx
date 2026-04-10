import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboards/dashboard.css";
const NAV = [
  { icon: "🏠", label: "Tableau de bord", id: "dashboard" },
  { icon: "👥", label: "Utilisateurs", id: "users" },
  { icon: "🏢", label: "Départements", id: "departments" },
  { icon: "🖥", label: "Ressources", id: "resources" },
  { icon: "📋", label: "Appels d'offres", id: "tenders" },
  { icon: "🔧", label: "Maintenance", id: "maintenance" },
  { icon: "⚙️", label: "Paramètres", id: "settings" },
];

const USERS = [
  {
    id: 1,
    name: "Dr. Amina Bensalem",
    role: "Chef Département",
    dept: "Informatique",
    status: "Actif",
  },
  {
    id: 2,
    name: "Pr. Karim Ouali",
    role: "Enseignant",
    dept: "Mathématiques",
    status: "Actif",
  },
  {
    id: 3,
    name: "Hassan Mourabit",
    role: "Responsable",
    dept: "Direction",
    status: "Actif",
  },
  {
    id: 4,
    name: "TechnoSup SARL",
    role: "Fournisseur",
    dept: "—",
    status: "En attente",
  },
  {
    id: 5,
    name: "Ali Zemmouri",
    role: "Technicien",
    dept: "Maintenance",
    status: "Actif",
  },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <div className="sidebar-logo-text">
            GestRes
            <span>Administration</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div
            className="user-avatar"
            style={{ background: "rgba(232,93,38,0.25)", color: "#ff9965" }}
          >
            AD
          </div>
          <div className="user-info">
            <div className="user-name">Super Admin</div>
            <div className="user-role-badge">Administrateur</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {NAV.map((n) => (
            <div
              key={n.id}
              className={`nav-item${active === n.id ? " active" : ""}`}
              onClick={() => setActive(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
              {n.id === "users" && <span className="nav-badge">4</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={() => navigate("/login")}>
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <h1>Tableau de bord Admin</h1>
            <p>Vue d'ensemble de la plateforme</p>
          </div>
          <div className="topbar-right">
            <div className="icon-btn">
              🔔
              <span className="notif-dot" />
            </div>
            <div className="icon-btn">⚙️</div>
          </div>
        </div>

        <div className="page-body">
          <div className="stats-grid">
            {[
              {
                icon: "👥",
                label: "Utilisateurs",
                value: "48",
                delta: "+3 ce mois",
                trend: "up",
                color: "blue",
              },
              {
                icon: "🏢",
                label: "Départements",
                value: "7",
                delta: "Stable",
                trend: "neutral",
                color: "green",
              },
              {
                icon: "🖥",
                label: "Ressources",
                value: "312",
                delta: "+18 livrées",
                trend: "up",
                color: "orange",
              },
              {
                icon: "📋",
                label: "Appels d'offres",
                value: "5",
                delta: "2 en cours",
                trend: "neutral",
                color: "yellow",
              },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className={`stat-card-icon ${s.color}`}>{s.icon}</div>
                <div className="stat-card-body">
                  <div className="stat-card-label">{s.label}</div>
                  <div className="stat-card-value">{s.value}</div>
                  <div className={`stat-card-delta ${s.trend}`}>{s.delta}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="content-grid">
            {/* Users table */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Utilisateurs récents</span>
                <div className="card-actions">
                  <button className="btn-sm btn-outline">Filtrer</button>
                  <button className="btn-sm btn-filled">+ Ajouter</button>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Rôle</th>
                      <th>Département</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {USERS.map((u) => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 500 }}>{u.name}</td>
                        <td className="td-muted">{u.role}</td>
                        <td className="td-muted">{u.dept}</td>
                        <td>
                          <span
                            className={`badge ${u.status === "Actif" ? "badge-success" : "badge-warning"}`}
                          >
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick actions */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Actions rapides</span>
              </div>
              {[
                {
                  icon: "👤",
                  label: "Créer un utilisateur",
                  color: "blue",
                  sub: "Admin, chef, technicien…",
                },
                {
                  icon: "🏢",
                  label: "Nouveau département",
                  color: "green",
                  sub: "Ajouter un département",
                },
                {
                  icon: "📤",
                  label: "Exporter les données",
                  color: "yellow",
                  sub: "CSV / Excel",
                },
                {
                  icon: "🗑",
                  label: "Gestion liste noire",
                  color: "red",
                  sub: "Fournisseurs exclus",
                },
              ].map((a) => (
                <div
                  key={a.label}
                  className="list-item"
                  style={{ cursor: "pointer" }}
                >
                  <div className={`list-item-icon stat-card-icon ${a.color}`}>
                    {a.icon}
                  </div>
                  <div className="list-item-body">
                    <div className="list-item-title">{a.label}</div>
                    <div className="list-item-meta">{a.sub}</div>
                  </div>
                  <span
                    style={{ color: "var(--text-muted)", fontSize: "1rem" }}
                  >
                    ›
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
