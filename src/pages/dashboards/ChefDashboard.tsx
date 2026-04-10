import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboards/dashboard.css";
const NAV = [
  { icon: "🏠", label: "Tableau de bord", id: "dashboard" },
  { icon: "📝", label: "Besoins enseignants", id: "needs" },
  { icon: "📅", label: "Réunion de concertation", id: "meeting" },
  { icon: "📤", label: "Envoi au responsable", id: "submit" },
  { icon: "🖥", label: "Ressources du département", id: "resources" },
];

const NEEDS = [
  {
    id: 1,
    enseignant: "Pr. Karim Ouali",
    type: "Ordinateur",
    spec: "i7 / 16Go RAM / 512 SSD",
    status: "Validé",
  },
  {
    id: 2,
    enseignant: "Dr. Fatima Idrissi",
    type: "Imprimante",
    spec: "Laser, 40ppm, 1200dpi",
    status: "En attente",
  },
  {
    id: 3,
    enseignant: "Pr. Youssef Alami",
    type: "Ordinateur",
    spec: "i5 / 8Go RAM / 256 SSD",
    status: "Modifié",
  },
  {
    id: 4,
    enseignant: "Dr. Sanaa Rami",
    type: "Ordinateur",
    spec: "i7 / 32Go RAM / 1To SSD",
    status: "En attente",
  },
];

export default function ChefDashboard() {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  const statusBadge = (s: string) => {
    if (s === "Validé") return "badge-success";
    if (s === "Modifié") return "badge-warning";
    return "badge-neutral";
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <div className="sidebar-logo-text">
            GestRes
            <span>Chef Département</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div
            className="user-avatar"
            style={{ background: "rgba(13,148,136,0.25)", color: "#0d9488" }}
          >
            CD
          </div>
          <div className="user-info">
            <div className="user-name">Dr. Amina Bensalem</div>
            <div className="user-role-badge">Chef Département — Info</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Gestion</div>
          {NAV.map((n) => (
            <div
              key={n.id}
              className={`nav-item${active === n.id ? " active" : ""}`}
              onClick={() => setActive(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
              {n.id === "needs" && <span className="nav-badge">4</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={() => navigate("/login")}>
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <h1>Département Informatique</h1>
            <p>Gestion des besoins en ressources matérielles</p>
          </div>
          <div className="topbar-right">
            <button
              className="btn-sm btn-filled"
              style={{ height: 38, padding: "0 16px" }}
            >
              📤 Envoyer au responsable
            </button>
            <div className="icon-btn">
              🔔
              <span className="notif-dot" />
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="stats-grid">
            {[
              {
                icon: "👨‍🏫",
                label: "Enseignants",
                value: "12",
                delta: "Dans le département",
                color: "blue",
              },
              {
                icon: "📝",
                label: "Besoins reçus",
                value: "4",
                delta: "2 en attente",
                color: "yellow",
              },
              {
                icon: "✅",
                label: "Besoins validés",
                value: "1",
                delta: "Prêts à envoyer",
                color: "green",
              },
              {
                icon: "🖥",
                label: "Ressources actives",
                value: "28",
                delta: "Affectées au dept.",
                color: "orange",
              },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className={`stat-card-icon ${s.color}`}>{s.icon}</div>
                <div className="stat-card-body">
                  <div className="stat-card-label">{s.label}</div>
                  <div className="stat-card-value">{s.value}</div>
                  <div className="stat-card-delta neutral">{s.delta}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Besoins des enseignants</span>
                <div className="card-actions">
                  <button className="btn-sm btn-outline">
                    Convoquer réunion
                  </button>
                  <button className="btn-sm btn-accent">
                    + Ajouter besoin dept.
                  </button>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Enseignant</th>
                      <th>Type</th>
                      <th>Spécifications</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NEEDS.map((n) => (
                      <tr key={n.id}>
                        <td style={{ fontWeight: 500 }}>{n.enseignant}</td>
                        <td>
                          <span style={{ fontSize: "0.85rem" }}>
                            {n.type === "Ordinateur" ? "🖥" : "🖨"} {n.type}
                          </span>
                        </td>
                        <td className="td-muted">{n.spec}</td>
                        <td>
                          <span className={`badge ${statusBadge(n.status)}`}>
                            {n.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn-sm btn-outline">✏️</button>
                            <button className="btn-sm btn-outline">✓</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Besoin département</span>
              </div>
              <div style={{ padding: "1rem 1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                    marginBottom: "1rem",
                  }}
                >
                  Matériel commun pour l'ensemble du département
                </p>
                {[
                  { label: "Serveur NAS 8To", status: "Planifié" },
                  { label: "Switch 48 ports", status: "Planifié" },
                  { label: "Projecteur 4K × 2", status: "Planifié" },
                ].map((r) => (
                  <div key={r.label} className="list-item">
                    <div className="list-item-icon stat-card-icon blue">🔧</div>
                    <div className="list-item-body">
                      <div className="list-item-title">{r.label}</div>
                    </div>
                    <span className="badge badge-info">{r.status}</span>
                  </div>
                ))}
                <button
                  className="btn-sm btn-filled"
                  style={{ marginTop: 12, width: "100%", height: 38 }}
                >
                  + Ajouter un équipement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
