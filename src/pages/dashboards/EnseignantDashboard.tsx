import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboards/dashboard.css";
const NAV = [
  { icon: "🏠", label: "Tableau de bord", id: "dashboard" },
  { icon: "📝", label: "Mes besoins", id: "needs" },
  { icon: "🖥", label: "Mes ressources", id: "resources" },
  { icon: "🔧", label: "Signaler une panne", id: "breakdown" },
  { icon: "📋", label: "Historique pannes", id: "history" },
];

const MY_RESOURCES = [
  {
    id: "INV-2024-001",
    label: "Ordinateur HP EliteBook",
    spec: "i7 / 16Go / 512SSD",
    date: "Jan 2024",
    status: "Fonctionnel",
  },
  {
    id: "INV-2024-015",
    label: "Imprimante Canon LBP6230",
    spec: "Laser / 25ppm",
    date: "Mar 2024",
    status: "En panne",
  },
];

const PANNES = [
  {
    id: 1,
    resource: "Imprimante Canon LBP6230",
    date: "08/04/2025",
    type: "Matériel",
    freq: "Fréquente",
    status: "Envoyé technicien",
  },
  {
    id: 2,
    resource: "Ordinateur HP EliteBook",
    date: "12/02/2025",
    type: "Logiciel",
    freq: "Rare",
    status: "Résolu",
  },
];

export default function EnseignantDashboard() {
  const [active, setActive] = useState("dashboard");
  const [showPanneForm, setShowPanneForm] = useState(false);
  const navigate = useNavigate();

  const panneForm = (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.5rem",
        marginBottom: "1.25rem",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1rem",
          fontWeight: 600,
          marginBottom: "1rem",
        }}
      >
        🔧 Signaler une panne
      </h3>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        {[
          { label: "Ressource concernée", placeholder: "Sélectionner…" },
          { label: "Date d'apparition", placeholder: "jj/mm/aaaa" },
        ].map((f) => (
          <div
            key={f.label}
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          >
            <label
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "var(--text)",
              }}
            >
              {f.label}
            </label>
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
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--text)",
            }}
          >
            Fréquence
          </label>
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
            <option>Rare</option>
            <option>Fréquente</option>
            <option>Permanente</option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--text)",
            }}
          >
            Ordre
          </label>
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
            <option>Matériel</option>
            <option>Logiciel (système)</option>
            <option>Logiciel (utilitaire)</option>
          </select>
        </div>
        <div
          style={{
            gridColumn: "1/-1",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label
            style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--text)",
            }}
          >
            Description de la panne
          </label>
          <textarea
            placeholder="Décrivez le problème en détail…"
            rows={3}
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
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: "1rem" }}>
        <button className="btn-sm btn-filled">Envoyer au technicien</button>
        <button
          className="btn-sm btn-outline"
          onClick={() => setShowPanneForm(false)}
        >
          Annuler
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <div className="sidebar-logo-text">
            GestRes
            <span>Enseignant</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div
            className="user-avatar"
            style={{ background: "rgba(42,82,152,0.25)", color: "#2a5298" }}
          >
            KO
          </div>
          <div className="user-info">
            <div className="user-name">Pr. Karim Ouali</div>
            <div className="user-role-badge">Enseignant — Mathématiques</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((n) => (
            <div
              key={n.id}
              className={`nav-item${active === n.id ? " active" : ""}`}
              onClick={() => {
                setActive(n.id);
                if (n.id === "breakdown") setShowPanneForm(true);
              }}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
              {n.id === "breakdown" && <span className="nav-badge">!</span>}
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
            <h1>Mon espace enseignant</h1>
            <p>Ressources, besoins et pannes</p>
          </div>
          <div className="topbar-right">
            <button
              className="btn-sm btn-accent"
              style={{ height: 38, padding: "0 16px" }}
              onClick={() => setShowPanneForm(true)}
            >
              🔧 Signaler panne
            </button>
            <div className="icon-btn">🔔</div>
          </div>
        </div>

        <div className="page-body">
          <div className="stats-grid">
            {[
              {
                icon: "🖥",
                label: "Mes ressources",
                value: "2",
                color: "blue",
              },
              { icon: "⚠️", label: "Pannes actives", value: "1", color: "red" },
              {
                icon: "📝",
                label: "Besoins soumis",
                value: "1",
                color: "yellow",
              },
              {
                icon: "✅",
                label: "Pannes résolues",
                value: "1",
                color: "green",
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

          {showPanneForm && panneForm}

          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Mes ressources affectées</span>
              </div>
              {MY_RESOURCES.map((r) => (
                <div key={r.id} className="list-item">
                  <div
                    className={`list-item-icon stat-card-icon ${r.status === "En panne" ? "red" : "green"}`}
                  >
                    {r.label.startsWith("Ord") ? "🖥" : "🖨"}
                  </div>
                  <div className="list-item-body">
                    <div className="list-item-title">{r.label}</div>
                    <div className="list-item-meta">
                      {r.spec} · {r.id} · Depuis {r.date}
                    </div>
                  </div>
                  <span
                    className={`badge ${r.status === "En panne" ? "badge-danger" : "badge-success"}`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Historique pannes</span>
              </div>
              {PANNES.map((p) => (
                <div key={p.id} className="list-item">
                  <div className="list-item-icon stat-card-icon orange">⚠️</div>
                  <div className="list-item-body">
                    <div
                      className="list-item-title"
                      style={{ fontSize: "0.82rem" }}
                    >
                      {p.resource}
                    </div>
                    <div className="list-item-meta">
                      {p.date} · {p.type} · {p.freq}
                    </div>
                  </div>
                  <span
                    className={`badge ${p.status === "Résolu" ? "badge-success" : "badge-warning"}`}
                  >
                    {p.status}
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
