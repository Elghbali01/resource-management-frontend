import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboards/dashboard.css";
const NAV = [
  { icon: "🏠", label: "Tableau de bord", id: "dashboard" },
  { icon: "🔧", label: "Pannes signalées", id: "breakdowns", badge: 3 },
  { icon: "📝", label: "Mes constats", id: "reports" },
  { icon: "📋", label: "Interventions", id: "interventions" },
  { icon: "🖥", label: "Ressources", id: "resources" },
];

const PANNES = [
  {
    id: 1,
    enseignant: "Pr. Karim Ouali",
    resource: "Imprimante Canon LBP6230",
    dept: "Mathématiques",
    date: "08/04/2025",
    type: "Matériel",
    freq: "Fréquente",
    status: "Nouveau",
  },
  {
    id: 2,
    enseignant: "Dr. Fatima Idrissi",
    resource: "Ordinateur HP EliteBook",
    dept: "Informatique",
    date: "07/04/2025",
    type: "Logiciel",
    freq: "Rare",
    status: "En cours",
  },
  {
    id: 3,
    enseignant: "Pr. Youssef Alami",
    resource: 'Écran Dell 24"',
    dept: "Physique",
    date: "05/04/2025",
    type: "Matériel",
    freq: "Permanente",
    status: "Nouveau",
  },
];

export default function TechnicienDashboard() {
  const [active, setActive] = useState("dashboard");
  const [selectedPanne, setSelectedPanne] = useState<number | null>(null);
  const navigate = useNavigate();

  const constateForm = selectedPanne !== null && (
    <div
      className="card"
      style={{ marginBottom: "1.25rem", border: "2px solid var(--accent)" }}
    >
      <div className="card-header" style={{ background: "var(--accent-50)" }}>
        <span className="card-title">
          📝 Rédiger un constat — Panne #{selectedPanne}
        </span>
        <button
          className="btn-sm btn-outline"
          onClick={() => setSelectedPanne(null)}
        >
          ✕
        </button>
      </div>
      <div style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          {[
            { label: "Date d'apparition", placeholder: "jj/mm/aaaa" },
            {
              label: "Fréquence",
              type: "select",
              options: ["Rare", "Fréquente", "Permanente"],
            },
            {
              label: "Ordre",
              type: "select",
              options: [
                "Matériel",
                "Logiciel (système)",
                "Logiciel (utilitaire)",
              ],
            },
          ].map((f) => (
            <div
              key={f.label}
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <label style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                {f.label}
              </label>
              {f.type === "select" ? (
                <select
                  style={{
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "1.5px solid var(--border)",
                    fontFamily: "var(--font)",
                    fontSize: "0.88rem",
                    background: "var(--surface)",
                    color: "var(--text)",
                    outline: "none",
                  }}
                >
                  {f.options!.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  placeholder={f.placeholder}
                  style={{
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "1.5px solid var(--border)",
                    fontFamily: "var(--font)",
                    fontSize: "0.88rem",
                    outline: "none",
                    color: "var(--text)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginBottom: "1.25rem",
          }}
        >
          <label style={{ fontSize: "0.8rem", fontWeight: 500 }}>
            Explication de la panne
          </label>
          <textarea
            placeholder="Décrivez précisément la panne, les tests effectués et vos observations…"
            rows={4}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1.5px solid var(--border)",
              fontFamily: "var(--font)",
              fontSize: "0.88rem",
              resize: "vertical",
              color: "var(--text)",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            background: "var(--warning-50)",
            border: "1px solid rgba(217,119,6,0.2)",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: "0.82rem",
            color: "var(--warning)",
            marginBottom: "1.25rem",
          }}
        >
          ⚠️ Si la panne est sévère, ce constat sera envoyé au responsable pour
          décision (retour fournisseur ou échange sous garantie).
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-sm btn-filled">
            Envoyer le constat au responsable
          </button>
          <button className="btn-sm btn-outline">Marquer comme réparé</button>
          <button
            className="btn-sm btn-outline"
            onClick={() => setSelectedPanne(null)}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🔧</div>
          <div className="sidebar-logo-text">
            GestRes
            <span>Technicien</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div
            className="user-avatar"
            style={{ background: "rgba(220,38,38,0.2)", color: "#dc2626" }}
          >
            AZ
          </div>
          <div className="user-info">
            <div className="user-name">Ali Zemmouri</div>
            <div className="user-role-badge">Technicien Maintenance</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((n) => (
            <div
              key={n.id}
              className={`nav-item${active === n.id ? " active" : ""}`}
              onClick={() => setActive(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
              {n.badge && <span className="nav-badge">{n.badge}</span>}
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
            <h1>Service de Maintenance</h1>
            <p>Pannes signalées et interventions</p>
          </div>
          <div className="topbar-right">
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
                icon: "🔴",
                label: "Nouvelles pannes",
                value: "2",
                color: "red",
              },
              { icon: "🟡", label: "En cours", value: "1", color: "yellow" },
              {
                icon: "✅",
                label: "Résolues ce mois",
                value: "7",
                color: "green",
              },
              {
                icon: "📝",
                label: "Constats rédigés",
                value: "3",
                color: "blue",
              },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className={`stat-card-icon ${s.color}`}>{s.icon}</div>
                <div className="stat-card-body">
                  <div className="stat-card-label">{s.label}</div>
                  <div className="stat-card-value">{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {constateForm}

          <div className="card">
            <div className="card-header">
              <span className="card-title">Pannes à traiter</span>
              <span className="badge badge-danger">3 actives</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ressource</th>
                    <th>Département</th>
                    <th>Enseignant</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Fréquence</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {PANNES.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>{p.resource}</td>
                      <td className="td-muted">{p.dept}</td>
                      <td className="td-muted">{p.enseignant}</td>
                      <td className="td-muted">{p.date}</td>
                      <td>
                        <span
                          className={`badge ${p.type === "Matériel" ? "badge-warning" : "badge-info"}`}
                        >
                          {p.type}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${p.freq === "Permanente" ? "badge-danger" : p.freq === "Fréquente" ? "badge-warning" : "badge-neutral"}`}
                        >
                          {p.freq}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${p.status === "En cours" ? "badge-info" : "badge-neutral"}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            className="btn-sm btn-accent"
                            onClick={() => setSelectedPanne(p.id)}
                          >
                            📝 Constat
                          </button>
                          <button className="btn-sm btn-outline">
                            Intervenir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
