import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboards/dashboard.css";
const NAV = [
  { icon: "🏠", label: "Tableau de bord", id: "dashboard" },
  { icon: "📋", label: "Appels d'offres", id: "tenders", badge: 2 },
  { icon: "🏢", label: "Fournisseurs", id: "suppliers" },
  { icon: "🚚", label: "Livraisons", id: "deliveries" },
  { icon: "🏷", label: "Inventaire", id: "inventory" },
  { icon: "📌", label: "Affectations", id: "affectations" },
  { icon: "🔧", label: "Pannes / Constat", id: "breakdowns", badge: 3 },
  { icon: "🚫", label: "Liste noire", id: "blacklist" },
];

const TENDERS = [
  {
    id: "AO-2025-001",
    depts: ["Informatique", "Mathématiques"],
    start: "01/04/2025",
    end: "30/04/2025",
    offers: 3,
    status: "Ouvert",
  },
  {
    id: "AO-2025-002",
    depts: ["Physique"],
    start: "15/03/2025",
    end: "15/04/2025",
    offers: 1,
    status: "Clôturé",
  },
];

const OFFERS = [
  {
    id: 1,
    ao: "AO-2025-001",
    fournisseur: "TechnoSup SARL",
    total: "145 000 MAD",
    livraison: "15/05/2025",
    garantie: "24 mois",
    status: "Retenu",
  },
  {
    id: 2,
    ao: "AO-2025-001",
    fournisseur: "InfoPro Maroc",
    total: "162 000 MAD",
    livraison: "20/05/2025",
    garantie: "12 mois",
    status: "Rejeté",
  },
  {
    id: 3,
    ao: "AO-2025-001",
    fournisseur: "DataTech",
    total: "158 000 MAD",
    livraison: "18/05/2025",
    garantie: "18 mois",
    status: "Rejeté",
  },
];

export default function ResponsableDashboard() {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <div className="sidebar-logo-text">
            GestRes
            <span>Responsable</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div
            className="user-avatar"
            style={{ background: "rgba(217,119,6,0.25)", color: "#d97706" }}
          >
            HM
          </div>
          <div className="user-info">
            <div className="user-name">Hassan Mourabit</div>
            <div className="user-role-badge">Responsable Ressources</div>
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
            <h1>Responsable Ressources</h1>
            <p>Appels d'offres, inventaire, affectations</p>
          </div>
          <div className="topbar-right">
            <button
              className="btn-sm btn-filled"
              style={{ height: 38, padding: "0 16px" }}
            >
              + Nouvel appel d'offres
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
                icon: "📋",
                label: "Appels d'offres",
                value: "2",
                delta: "1 ouvert",
                color: "blue",
              },
              {
                icon: "🏢",
                label: "Fournisseurs actifs",
                value: "8",
                delta: "1 en liste noire",
                color: "orange",
              },
              {
                icon: "🏷",
                label: "Ressources inventaire",
                value: "312",
                delta: "+18 ce mois",
                color: "green",
              },
              {
                icon: "⚠️",
                label: "Pannes en attente",
                value: "3",
                delta: "Action requise",
                color: "red",
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

          <div className="content-grid-full">
            {/* Appels d'offres */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Appels d'offres</span>
                <button className="btn-sm btn-filled">+ Créer</button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Référence</th>
                      <th>Départements</th>
                      <th>Période</th>
                      <th>Offres reçues</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TENDERS.map((t) => (
                      <tr key={t.id}>
                        <td
                          style={{
                            fontFamily: "monospace",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "var(--primary-light)",
                          }}
                        >
                          {t.id}
                        </td>
                        <td className="td-muted">{t.depts.join(", ")}</td>
                        <td className="td-muted">
                          {t.start} → {t.end}
                        </td>
                        <td style={{ fontWeight: 600 }}>{t.offers}</td>
                        <td>
                          <span
                            className={`badge ${t.status === "Ouvert" ? "badge-success" : "badge-neutral"}`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn-sm btn-outline">
                              👁 Voir offres
                            </button>
                            {t.status === "Ouvert" && (
                              <button className="btn-sm btn-accent">
                                Clôturer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Offres soumises */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Offres reçues — AO-2025-001</span>
                <span className="badge badge-info">Sélection en cours</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Fournisseur</th>
                      <th>Total</th>
                      <th>Livraison</th>
                      <th>Garantie</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OFFERS.map((o) => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 500 }}>{o.fournisseur}</td>
                        <td
                          style={{ fontWeight: 600, color: "var(--primary)" }}
                        >
                          {o.total}
                        </td>
                        <td className="td-muted">{o.livraison}</td>
                        <td className="td-muted">{o.garantie}</td>
                        <td>
                          <span
                            className={`badge ${o.status === "Retenu" ? "badge-success" : o.status === "Rejeté" ? "badge-danger" : "badge-neutral"}`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            {o.status !== "Retenu" && o.status !== "Rejeté" && (
                              <button className="btn-sm btn-filled">
                                ✓ Retenir
                              </button>
                            )}
                            <button className="btn-sm btn-outline">
                              🚫 Exclure
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
    </div>
  );
}
