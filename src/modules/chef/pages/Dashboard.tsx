// src/modules/chef/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import "../../admin/pages/StatistiquesPage.css"; // Reuse the same CSS

/* ── Animated counter hook ────────────────────── */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

/* ── Mini sparkline (SVG path) ───────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const w = 120, h = 40;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(" ");
  const area = `M${pts.split(" ").join("L")} L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace("#", "")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Donut chart ─────────────────────────────── */
function DonutChart({ roles }: { roles: any[] }) {
  const size = 160, stroke = 28, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      {roles.map((role) => {
        const dash = (role.pct / 100) * circ;
        const gap = circ - dash;
        const rotation = -90 + (offset / 100) * 360;
        offset += role.pct;
        return (
          <circle
            key={role.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={role.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={0}
            transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        );
      })}
      <text x={size / 2} y={size / 2 - 6} textAnchor="middle" fill="white" fontSize="22" fontWeight="700">
        {roles.reduce((a, r) => a + r.count, 0)}
      </text>
      <text x={size / 2} y={size / 2 + 16} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
        ressources
      </text>
    </svg>
  );
}

/* ── Bar chart horizontal ────────────────────── */
function HorizontalBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="stat-hbar">
      <div className="stat-hbar-meta">
        <span className="stat-hbar-label">{label}</span>
        <span className="stat-hbar-value">{value}</span>
      </div>
      <div className="stat-hbar-track">
        <div className="stat-hbar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ── KPI Card ──────────────────────────────────── */
function KpiCard({
  label, value, icon, color, trend, trendUp, spark, loading,
}: {
  label: string; value: number; icon: React.ReactNode; color: string;
  trend: string; trendUp: boolean; spark: React.ReactNode; loading: boolean;
}) {
  return (
    <div className="sp-kpi-card">
      <div className="sp-kpi-top">
        <div className="sp-kpi-icon" style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        <span className={`sp-kpi-trend ${trendUp ? "sp-kpi-trend--up" : "sp-kpi-trend--warn"}`}>
          {trend}
        </span>
      </div>
      <div className="sp-kpi-value">
        {loading ? <div className="sp-skeleton sp-skeleton--number" /> : value}
      </div>
      <div className="sp-kpi-label">{label}</div>
      <div className="sp-kpi-spark">{!loading && spark}</div>
    </div>
  );
}

// Icons
const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconAlert = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);


export default function ChefDashboard() {
  const { nom, prenom } = useAuth();
  
  // Static stats values for Chef
  const stats = {
    totalBesoins: 45,
    besoinsValides: 28,
    besoinsEnAttente: 12,
    incidentsSignales: 5,
    enseignants: 18,
    equipements: 124,
  };

  const animTotalBesoins = useCountUp(stats.totalBesoins);
  const animBesoinsValides = useCountUp(stats.besoinsValides);
  const animEnAttente = useCountUp(stats.besoinsEnAttente);
  const animIncidents = useCountUp(stats.incidentsSignales);

  const roles = [
    { label: "Ordinateurs", count: 85, color: "#3b82f6", pct: Math.round((85/124)*100) },
    { label: "Imprimantes", count: 15, color: "#10b981", pct: Math.round((15/124)*100) },
    { label: "Vidéoprojecteurs", count: 24, color: "#f59e0b", pct: Math.round((24/124)*100) },
  ];

  return (
    <DashboardLayout
      role="CHEF_DEPARTEMENT"
      nom={nom}
      prenom={prenom}
      navItems={[
        { label: "Dashboard", path: "/chef", icon: "📊" },
        { label: "Besoins", path: "/chef/besoins", icon: "📦" },
      ]}
    >
      <div className="sp-root">
        {/* ── Background orbs ── */}
        <div className="sp-bg">
          <div className="sp-orb sp-orb1" />
          <div className="sp-orb sp-orb2" />
          <div className="sp-orb sp-orb3" />
          <div className="sp-grid" />
        </div>

        <div className="sp-content">
          {/* Header */}
          <header className="sp-header">
            <div>
              <div className="sp-header-eyebrow">
                <span className="sp-pulse-dot" />
                Tableau de bord
              </div>
              <h1 className="sp-title">Statistiques du Département</h1>
              <p className="sp-subtitle">Vue globale des ressources et besoins de votre département</p>
            </div>
            <div className="sp-header-actions">
              <button className="sp-refresh-btn" onClick={() => {}} >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
                </svg>
                Actualiser
              </button>
            </div>
          </header>

          {/* KPI */}
          <div className="sp-kpi-grid">
            <KpiCard
              label="Besoins Exprimés"
              value={animTotalBesoins}
              icon={<IconBox />}
              color="#3b82f6"
              trend="Ce mois"
              trendUp={true}
              spark={<Sparkline data={[2, 5, 8, 12, 14, 25, stats.totalBesoins]} color="#3b82f6" />}
              loading={false}
            />
            <KpiCard
              label="Besoins Validés"
              value={animBesoinsValides}
              icon={<IconCheck />}
              color="#10b981"
              trend={`${Math.round((stats.besoinsValides / stats.totalBesoins) * 100)}%`}
              trendUp={true}
              spark={<Sparkline data={[1, 3, 6, 8, 10, 18, stats.besoinsValides]} color="#10b981" />}
              loading={false}
            />
            <KpiCard
              label="En attente"
              value={animEnAttente}
              icon={<IconClock />}
              color="#f59e0b"
              trend="Traitement"
              trendUp={false}
              spark={<Sparkline data={[5, 7, 6, 8, 10, 11, stats.besoinsEnAttente]} color="#f59e0b" />}
              loading={false}
            />
            <KpiCard
              label="Incidents signalés"
              value={animIncidents}
              icon={<IconAlert />}
              color="#e85d26"
              trend="Urgent"
              trendUp={false}
              spark={<Sparkline data={[0, 1, 0, 2, 1, 3, stats.incidentsSignales]} color="#e85d26" />}
              loading={false}
            />
          </div>

          <div className="sp-charts-row">
            {/* Donut */}
            <div className="sp-card sp-card--donut">
              <div className="sp-card-header">
                <h2 className="sp-card-title">Ressources allouées</h2>
                <span className="sp-card-badge">{stats.equipements} au total</span>
              </div>
              <div className="sp-donut-wrap">
                <DonutChart roles={roles} />
                <div className="sp-donut-legend">
                  {roles.map((r) => (
                    <div key={r.label} className="sp-legend-item">
                      <span className="sp-legend-dot" style={{ background: r.color }} />
                      <span className="sp-legend-label">{r.label}</span>
                      <span className="sp-legend-count">{r.count}</span>
                      <span className="sp-legend-pct">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bars */}
            <div className="sp-card sp-card--bars">
              <div className="sp-card-header">
                <h2 className="sp-card-title">État des demandes</h2>
                <span className="sp-card-badge">{stats.totalBesoins} requêtes</span>
              </div>
              <div className="sp-bars-wrap">
                <HorizontalBar label="Validées" value={stats.besoinsValides} max={stats.totalBesoins} color="#10b981" />
                <HorizontalBar label="En attente" value={stats.besoinsEnAttente} max={stats.totalBesoins} color="#f59e0b" />
                <HorizontalBar label="Rejetées" value={stats.totalBesoins - stats.besoinsValides - stats.besoinsEnAttente} max={stats.totalBesoins} color="#e85d26" />
              </div>
              <div className="sp-status-pills">
                <div className="sp-status-pill sp-status-pill--green">
                  <span>{stats.besoinsValides}</span> Validées
                </div>
                <div className="sp-status-pill sp-status-pill--amber">
                  <span>{stats.besoinsEnAttente}</span> En attente
                </div>
                <div className="sp-status-pill sp-status-pill--gray" style={{ background: 'rgba(232,93,38,0.12)', color: '#fb923c' }}>
                  <span>{stats.totalBesoins - stats.besoinsValides - stats.besoinsEnAttente}</span> Rejetées
                </div>
              </div>
            </div>

            {/* List */}
            <div className="sp-card sp-card--list">
              <div className="sp-card-header">
                <h2 className="sp-card-title">Dernières requêtes d'enseignants</h2>
                <span className="sp-card-badge">{stats.enseignants} total</span>
              </div>
              <div className="sp-user-list">
                {[
                  { id: 1, nom: "Dupont", prenom: "Jean", email: "jean.dupont@univ.fr", role: "ENSEIGNANT", request: "Ordinateur Portable" },
                  { id: 2, nom: "Martin", prenom: "Claire", email: "claire.martin@univ.fr", role: "ENSEIGNANT", request: "Imprimante A4" },
                  { id: 3, nom: "Bernard", prenom: "Luc", email: "luc.bernard@univ.fr", role: "ENSEIGNANT", request: "Vidéoprojecteur" },
                  { id: 4, nom: "Robert", prenom: "Sophie", email: "sophie.robert@univ.fr", role: "ENSEIGNANT", request: "Écran 27\"" },
                ].map((u) => (
                  <div key={u.id} className="sp-user-row">
                    <div className="sp-user-avatar" style={{ background: "#64748b" }}>
                      {u.prenom[0]}{u.nom[0]}
                    </div>
                    <div className="sp-user-info">
                      <span className="sp-user-name">{u.prenom} {u.nom}</span>
                      <span className="sp-user-email">{u.request}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
