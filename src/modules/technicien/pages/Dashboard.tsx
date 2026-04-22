import { useEffect, useState } from "react";
import api from "../../../services/api";
import "../../admin/pages/StatistiquesPage.css";

/* ── Animated counter hook ────────────────────── */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
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

export default function TechnicienDashboard() {
  const [pannes, setPannes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<Date>(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/technicien/pannes");
      setPannes(data || []);
      setRefreshedAt(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stats calcs
  const signalees = pannes.filter(p => p.statut === "SIGNALEE").length;
  const enCours = pannes.filter(p => p.statut === "EN_COURS").length;
  const constats = pannes.filter(p => p.statut === "CONSTAT_ENVOYE").length;
  const severes = pannes.filter(p => p.severe === true).length;

  const topSignalees = pannes
    .filter(p => p.statut === "SIGNALEE")
    .sort((a, b) => new Date(b.dateSignalement).getTime() - new Date(a.dateSignalement).getTime())
    .slice(0, 5);

  const interventionsEnCours = pannes.filter(p => p.statut === "EN_COURS");

  const animSignalees = useCountUp(signalees);
  const animEnCours = useCountUp(enCours);
  const animConstats = useCountUp(constats);
  const animSeveres = useCountUp(severes);

  const timeStr = refreshedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="sp-root">
      <div className="sp-bg">
        <div className="sp-orb sp-orb1" />
        <div className="sp-orb sp-orb2" />
        <div className="sp-orb sp-orb3" />
        <div className="sp-grid" />
      </div>

      <div className="sp-content">
        <header className="sp-header">
          <div>
            <div className="sp-header-eyebrow">
              <span className="sp-pulse-dot" />
              Tableau de bord
            </div>
            <h1 className="sp-title">Espace Technicien</h1>
            <p className="sp-subtitle">Supervisez et gérez vos interventions de maintenance</p>
          </div>
          <div className="sp-header-actions">
            <span className="sp-refresh-info">Mis à jour à {timeStr}</span>
            <button className="sp-refresh-btn" onClick={loadData} disabled={loading}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              {loading ? "Chargement…" : "Actualiser"}
            </button>
          </div>
        </header>

        <div className="sp-kpi-grid">
          <KpiCard
            label="En attente d'intervention"
            value={animSignalees}
            icon={<IconAlert />}
            color="#f59e0b"
            trend="Pannes signalées"
            trendUp={true}
            loading={loading}
          />
          <KpiCard
            label="Interventions actives"
            value={animEnCours}
            icon={<IconWrench />}
            color="#3b82f6"
            trend="En cours"
            trendUp={enCours > 0}
            loading={loading}
          />
          <KpiCard
            label="Transmis au responsable"
            value={animConstats}
            icon={<IconDocument />}
            color="#10b981"
            trend="Constats rédigés"
            trendUp={true}
            loading={loading}
          />
          <KpiCard
            label="Nécessitent attention"
            value={animSeveres}
            icon={<IconWarning />}
            color="#ef4444"
            trend="Pannes sévères"
            trendUp={false}
            loading={loading}
            trendClassOverride={severes > 0 ? "text-red-600 bg-red-100" : "text-gray-500 bg-gray-100"}
          />
        </div>

        <div className="sp-charts-row" style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
          
          {/* Bloc Gauche - Pannes en attente */}
          <div className="sp-card sp-card--list" style={{ minHeight: "350px", overflow: "hidden" }}>
            <div className="sp-card-header">
              <h2 className="sp-card-title">Pannes en attente d'intervention</h2>
              <span className="sp-card-badge">{topSignalees.length} affichées</span>
            </div>
            <div className="overflow-x-auto w-full mt-4">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Chargement...</div>
              ) : topSignalees.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">Aucune panne en attente.</div>
              ) : (
                <table className="w-full text-left" style={{ fontSize: "0.85rem" }}>
                  <thead className="border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 pb-3 font-semibold">Inventaire</th>
                      <th className="px-4 pb-3 font-semibold">Matériel</th>
                      <th className="px-4 pb-3 font-semibold">Enseignant / Dept</th>
                      <th className="px-4 pb-3 font-semibold text-right">Signalement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topSignalees.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-blue-600 font-bold tracking-tight">
                          {p.numeroInventaire}
                          {p.severe && <span className="inline-block px-1.5 py-0.5 ml-2 text-[9px] font-bold uppercase tracking-wider text-red-700 bg-red-100 rounded border border-red-200">Sévère</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900 mb-0.5">{p.typeMateriel}</div>
                          <div className="text-[10px] uppercase tracking-wider text-gray-500">{p.marque}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-700">{p.enseignantPrenom} {p.enseignantNom}</div>
                          <div className="text-[10px] uppercase tracking-wider text-gray-500">{p.departementNom}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-right">
                          {p.dateSignalement ? new Date(p.dateSignalement).toLocaleDateString("fr-FR") : "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Bloc Droite - Interventions en cours */}
          <div className="sp-card sp-card--list" style={{ minHeight: "350px", overflow: "hidden" }}>
            <div className="sp-card-header">
              <h2 className="sp-card-title text-blue-600">Interventions en cours</h2>
              <span className="sp-card-badge bg-blue-50 text-blue-600 border-blue-100">{interventionsEnCours.length} total</span>
            </div>
            <div className="sp-user-list mt-6 space-y-3">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Chargement...</div>
              ) : interventionsEnCours.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">Aucune intervention en cours.</div>
              ) : (
                interventionsEnCours.map(p => (
                  <div key={p.id} className="sp-user-row bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 flex gap-4 items-center">
                     <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm ring-1 ring-blue-200 shrink-0">
                       <IconWrench width={16} height={16} />
                     </div>
                     <div className="min-w-0 flex-1">
                       <div className="font-bold text-gray-900 text-[13px] mb-1">{p.typeMateriel} {p.marque}</div>
                       <div className="text-[11px] text-gray-500 leading-relaxed font-medium">
                         <span className="font-mono text-blue-600 font-bold">{p.numeroInventaire}</span> • {p.departementNom}
                       </div>
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── KPI Card Component ────────────────────────── */
function KpiCard({
  label, value, icon, color, trend, trendUp, loading, trendClassOverride
}: {
  label: string; value: number; icon: React.ReactNode; color: string;
  trend: string; trendUp: boolean; loading: boolean; trendClassOverride?: string;
}) {
  return (
    <div className="sp-kpi-card relative overflow-hidden group bg-white shadow-sm border border-gray-100">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" style={{ background: color + '10' }} />
      <div className="sp-kpi-top relative z-10">
        <div className="sp-kpi-icon" style={{ background: `${color}15`, color, boxShadow: `0 0 15px ${color}10` }}>
          {icon}
        </div>
        <span className={trendClassOverride || `sp-kpi-trend ${trendUp ? "sp-kpi-trend--up" : "sp-kpi-trend--warn"}`}>
          {trend}
        </span>
      </div>
      <div className="sp-kpi-value relative z-10 mt-4 text-4xl font-black tabular-nums tracking-tight text-gray-800">
        {loading ? <div className="sp-skeleton sp-skeleton--number h-10 w-20" /> : value}
      </div>
      <div className="sp-kpi-label relative z-10 mt-1 text-sm font-medium text-gray-500 uppercase tracking-widest">{label}</div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────── */
const IconDocument = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const IconAlert = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconWarning = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconWrench = ({ width=24, height=24 }: { width?: number; height?: number }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
