import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import type { UserListResponse } from "../services/userService";
import "./StatistiquesPage.css";

/* ── Types ────────────────────────────────────── */
interface Stats {
  total: number;
  actifs: number;
  inactifs: number;
  admins: number;
  techniciens: number;
  fournisseurs: number;
  demandesEnAttente: number;
  interventions: number;
}

interface RoleData {
  label: string;
  count: number;
  color: string;
  pct: number;
}

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
function DonutChart({ roles }: { roles: RoleData[] }) {
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
        utilisateurs
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

/* ── Main component ──────────────────────────── */
export default function StatistiquesPage() {
  const [users, setUsers] = useState<UserListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<Date>(new Date());

  /* fake sparkline history — simulate weekly evolution */
  const [sparkData] = useState(() => ({
    users: [12, 18, 21, 25, 30, 34, 0],
    demandes: [3, 7, 5, 9, 12, 8, 0],
    interventions: [1, 4, 6, 4, 8, 10, 0],
  }));

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
      setRefreshedAt(new Date());

      // patch last sparkline point with real count
      sparkData.users[6] = data.length;
      sparkData.demandes[6] = data.filter((u) => u.status === "EN_ATTENTE").length;
      sparkData.interventions[6] = data.filter((u) => u.role === "TECHNICIEN").length;
    } catch {
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Computed stats ── */
  const stats: Stats = {
    total: users.length,
    actifs: users.filter((u) => u.status === "ACTIF").length,
    inactifs: users.filter((u) => u.status !== "ACTIF").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    techniciens: users.filter((u) => u.role === "TECHNICIEN").length,
    fournisseurs: users.filter((u) => u.role === "FOURNISSEUR").length,
    demandesEnAttente: users.filter((u) => u.status === "EN_ATTENTE").length,
    interventions: users.filter((u) => u.role === "TECHNICIEN").length,
  };

  const roles: RoleData[] = [
    { label: "Admins", count: stats.admins, color: "#e85d26", pct: stats.total ? Math.round((stats.admins / stats.total) * 100) : 0 },
    { label: "Techniciens", count: stats.techniciens, color: "#3b82f6", pct: stats.total ? Math.round((stats.techniciens / stats.total) * 100) : 0 },
    { label: "Fournisseurs", count: stats.fournisseurs, color: "#10b981", pct: stats.total ? Math.round((stats.fournisseurs / stats.total) * 100) : 0 },
  ];

  /* animated totals */
  const animTotal = useCountUp(stats.total);
  const animActifs = useCountUp(stats.actifs);
  const animDemandes = useCountUp(stats.demandesEnAttente);
  const animInterventions = useCountUp(stats.interventions);

  const timeStr = refreshedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="sp-root">
      {/* ── Background orbs ── */}
      <div className="sp-bg">
        <div className="sp-orb sp-orb1" />
        <div className="sp-orb sp-orb2" />
        <div className="sp-orb sp-orb3" />
        <div className="sp-grid" />
      </div>

      <div className="sp-content">
        {/* ── Header ── */}
        <header className="sp-header">
          <div>
            <div className="sp-header-eyebrow">
              <span className="sp-pulse-dot" />
              Tableau de bord
            </div>
            <h1 className="sp-title">Statistiques Administrateur</h1>
            <p className="sp-subtitle">Aperçu en temps réel de votre système GestRes</p>
          </div>
          <div className="sp-header-actions">
            <span className="sp-refresh-info">Mis à jour à {timeStr}</span>
            <button className="sp-refresh-btn" onClick={load} disabled={loading}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              {loading ? "Chargement…" : "Actualiser"}
            </button>
          </div>
        </header>

        {/* ── Error ── */}
        {error && (
          <div className="sp-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            {error}
          </div>
        )}

        {/* ── KPI Row ── */}
        <div className="sp-kpi-grid">
          <KpiCard
            label="Total Utilisateurs"
            value={animTotal}
            icon={<IconUsers />}
            color="#3b82f6"
            trend="+12%"
            trendUp={true}
            spark={<Sparkline data={sparkData.users} color="#3b82f6" />}
            loading={loading}
          />
          <KpiCard
            label="Utilisateurs Actifs"
            value={animActifs}
            icon={<IconCheck />}
            color="#10b981"
            trend={stats.total > 0 ? `${Math.round((stats.actifs / stats.total) * 100)}%` : "--"}
            trendUp={true}
            spark={<Sparkline data={[8, 14, 17, 20, 24, 28, stats.actifs]} color="#10b981" />}
            loading={loading}
          />
          <KpiCard
            label="Demandes en attente"
            value={animDemandes}
            icon={<IconClock />}
            color="#f59e0b"
            trend="À traiter"
            trendUp={false}
            spark={<Sparkline data={sparkData.demandes} color="#f59e0b" />}
            loading={loading}
          />
          <KpiCard
            label="Interventions"
            value={animInterventions}
            icon={<IconWrench />}
            color="#e85d26"
            trend="Techniciens"
            trendUp={true}
            spark={<Sparkline data={sparkData.interventions} color="#e85d26" />}
            loading={loading}
          />
        </div>

        {/* ── Charts row ── */}
        <div className="sp-charts-row">
          {/* Donut */}
          <div className="sp-card sp-card--donut">
            <div className="sp-card-header">
              <h2 className="sp-card-title">Répartition par rôle</h2>
              <span className="sp-card-badge">{stats.total} total</span>
            </div>
            <div className="sp-donut-wrap">
              {loading ? (
                <div className="sp-skeleton sp-skeleton--circle" />
              ) : (
                <DonutChart roles={roles} />
              )}
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

          {/* Status breakdown */}
          <div className="sp-card sp-card--bars">
            <div className="sp-card-header">
              <h2 className="sp-card-title">Statut des comptes</h2>
              <span className="sp-card-badge">{stats.actifs} actifs</span>
            </div>
            <div className="sp-bars-wrap">
              <HorizontalBar label="Actifs" value={stats.actifs} max={stats.total} color="#10b981" />
              <HorizontalBar label="Inactifs" value={stats.inactifs} max={stats.total} color="#6b7280" />
              <HorizontalBar label="En attente" value={stats.demandesEnAttente} max={stats.total} color="#f59e0b" />
            </div>

            <div className="sp-status-pills">
              <div className="sp-status-pill sp-status-pill--green">
                <span>{stats.actifs}</span> actifs
              </div>
              <div className="sp-status-pill sp-status-pill--gray">
                <span>{stats.inactifs}</span> inactifs
              </div>
              <div className="sp-status-pill sp-status-pill--amber">
                <span>{stats.demandesEnAttente}</span> en attente
              </div>
            </div>
          </div>

          {/* Quick list — derniers utilisateurs */}
          <div className="sp-card sp-card--list">
            <div className="sp-card-header">
              <h2 className="sp-card-title">Derniers inscrits</h2>
              <span className="sp-card-badge">{users.length > 5 ? "5 affichés" : `${users.length} total`}</span>
            </div>
            <div className="sp-user-list">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="sp-user-row sp-skeleton-row">
                      <div className="sp-skeleton sp-skeleton--avatar" />
                      <div style={{ flex: 1 }}>
                        <div className="sp-skeleton sp-skeleton--line" style={{ width: "60%", marginBottom: 6 }} />
                        <div className="sp-skeleton sp-skeleton--line" style={{ width: "40%" }} />
                      </div>
                    </div>
                  ))
                : users.slice(-5).reverse().map((u) => (
                    <div key={u.id} className="sp-user-row">
                      <div className="sp-user-avatar" style={{ background: roleColor(u.role) }}>
                        {u.prenom?.[0]?.toUpperCase()}{u.nom?.[0]?.toUpperCase()}
                      </div>
                      <div className="sp-user-info">
                        <span className="sp-user-name">{u.prenom} {u.nom}</span>
                        <span className="sp-user-email">{u.email}</span>
                      </div>
                      <span className={`sp-role-badge sp-role-badge--${u.role.toLowerCase()}`}>
                        {u.role}
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

/* ── Helpers ─────────────────────────────────── */
function roleColor(role: string) {
  if (role === "ADMIN") return "#e85d26";
  if (role === "TECHNICIEN") return "#3b82f6";
  return "#10b981";
}

/* ── Icons ───────────────────────────────────── */
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
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
const IconWrench = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);