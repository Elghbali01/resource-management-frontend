import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboards/dashboard.css";

const NAV = [
  { icon: "🏠", label: "Tableau de bord", id: "dashboard" },
  { icon: "📋", label: "Appels d'offres", id: "tenders", badge: 2 },
  { icon: "📤", label: "Mes propositions", id: "proposals" },
  { icon: "🔔", label: "Notifications", id: "notifications", badge: 1 },
  { icon: "👤", label: "Mon profil société", id: "profile" },
];

const OPEN_TENDERS = [
  {
    id: "AO-2025-001",
    titre: "Équipements informatiques — 3 départements",
    depts: ["Informatique", "Mathématiques", "Physique"],
    start: "01/04/2025",
    end: "30/04/2025",
    items: 24,
    status: "Ouvert",
  },
  {
    id: "AO-2025-003",
    titre: "Imprimantes réseau — Administration",
    depts: ["Administration"],
    start: "05/04/2025",
    end: "05/05/2025",
    items: 8,
    status: "Ouvert",
  },
];

const MY_PROPOSALS = [
  {
    id: "PROP-001",
    ao: "AO-2025-001",
    total: "145 000 MAD",
    submitted: "10/04/2025",
    status: "Retenu",
  },
  {
    id: "PROP-002",
    ao: "AO-2024-005",
    total: "88 000 MAD",
    submitted: "20/11/2024",
    status: "Rejeté",
  },
];

export default function FournisseurDashboard() {
  const [active, setActive] = useState("dashboard");
  const [showProposalForm, setShowProposalForm] = useState(false);
  const navigate = useNavigate();

  const proposalForm = (
    <div className="card" style={{ marginBottom: "1.25rem" }}>
      <div className="card-header">
        <span className="card-title">
          📤 Soumettre une proposition — AO-2025-001
        </span>
        <button
          className="btn-sm btn-outline"
          onClick={() => setShowProposalForm(false)}
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
            { label: "Date de livraison prévue", placeholder: "jj/mm/aaaa" },
            { label: "Durée de garantie (mois)", placeholder: "Ex : 24" },
          ].map((f) => (
            <div
              key={f.label}
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <label style={{ fontSize: "0.8rem", fontWeight: 500 }}>
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
        </div>

        <table
          style={{
            width: "100%",
            marginBottom: "1rem",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "var(--surface-2)" }}>
              {[
                "Ressource",
                "Marque proposée",
                "Prix unitaire (MAD)",
                "Quantité",
                "Total",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 12px",
                    fontSize: "0.73rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "var(--text-muted)",
                    textAlign: "left",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["Ordinateur (×10)", "Imprimante (×4)", 'Écran 24" (×10)'].map(
              (r) => (
                <tr key={r} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: "0.88rem",
                      fontWeight: 500,
                    }}
                  >
                    {r}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <input
                      placeholder="Marque"
                      style={{
                        width: "100%",
                        height: 32,
                        padding: "0 8px",
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                        fontFamily: "var(--font)",
                        fontSize: "0.82rem",
                        outline: "none",
                      }}
                    />
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <input
                      type="number"
                      placeholder="0"
                      style={{
                        width: "100%",
                        height: 32,
                        padding: "0 8px",
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                        fontFamily: "var(--font)",
                        fontSize: "0.82rem",
                        outline: "none",
                      }}
                    />
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                    }}
                  >
                    —
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>—</td>
                </tr>
              ),
            )}
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "0.9rem" }}>
            <strong>Total proposition :</strong>{" "}
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--primary)",
                fontFamily: "var(--font-display)",
              }}
            >
              — MAD
            </span>
          </div>
          <button
            className="btn-sm btn-filled"
            style={{ height: 40, padding: "0 24px" }}
          >
            Soumettre la proposition
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏢</div>
          <div className="sidebar-logo-text">
            GestRes
            <span>Fournisseur</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div
            className="user-avatar"
            style={{ background: "rgba(13,148,136,0.25)", color: "#0d9488" }}
          >
            TS
          </div>
          <div className="user-info">
            <div className="user-name">TechnoSup SARL</div>
            <div className="user-role-badge">Fournisseur certifié</div>
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
            <h1>Espace Fournisseur</h1>
            <p>Consultez les appels d'offres et soumettez vos propositions</p>
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
                icon: "📋",
                label: "AO disponibles",
                value: "2",
                color: "blue",
              },
              {
                icon: "📤",
                label: "Propositions soumises",
                value: "2",
                color: "orange",
              },
              {
                icon: "✅",
                label: "Offres retenues",
                value: "1",
                color: "green",
              },
              {
                icon: "❌",
                label: "Offres rejetées",
                value: "1",
                color: "red",
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

          {showProposalForm && proposalForm}

          <div className="content-grid">
            {/* Open tenders */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Appels d'offres ouverts</span>
                <span className="badge badge-success">2 disponibles</span>
              </div>
              {OPEN_TENDERS.map((t) => (
                <div key={t.id} className="list-item">
                  <div className="list-item-icon stat-card-icon blue">📋</div>
                  <div className="list-item-body">
                    <div className="list-item-title">{t.titre}</div>
                    <div className="list-item-meta">
                      {t.id} · {t.items} articles · Jusqu'au {t.end}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        display: "flex",
                        gap: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      {t.depts.map((d) => (
                        <span
                          key={d}
                          className="badge badge-info"
                          style={{ fontSize: "0.68rem" }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="btn-sm btn-filled"
                    style={{ flexShrink: 0 }}
                    onClick={() => setShowProposalForm(true)}
                  >
                    Proposer
                  </button>
                </div>
              ))}
            </div>

            {/* My proposals */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Mes propositions</span>
              </div>
              {MY_PROPOSALS.map((p) => (
                <div key={p.id} className="list-item">
                  <div
                    className={`list-item-icon stat-card-icon ${p.status === "Retenu" ? "green" : "red"}`}
                  >
                    {p.status === "Retenu" ? "✅" : "❌"}
                  </div>
                  <div className="list-item-body">
                    <div className="list-item-title">{p.ao}</div>
                    <div className="list-item-meta">
                      {p.total} · {p.submitted}
                    </div>
                  </div>
                  <span
                    className={`badge ${p.status === "Retenu" ? "badge-success" : "badge-danger"}`}
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
