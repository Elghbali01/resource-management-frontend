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

export default function EnseignantDashboard() {
  const [pannes, setPannes] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [demandes, setDemandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<Date>(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const [panRes, notifRes, unreadRes, demRes] = await Promise.all([
        api.get("/enseignant/pannes").then(r => r.data),
        api.get("/enseignant/notifications").then(r => r.data),
        api.get("/enseignant/notifications/non-lues").then(r => r.data),
        api.get("/enseignant/demandes-ouvertes").then(r => r.data)
      ]);
      setPannes(panRes || []);
      setNotifications(notifRes || []);
      setUnreadCount(unreadRes?.count || 0);
      setDemandes(demRes || []);
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
  const pannesTotal = pannes.length;
  const pannesSignalees = pannes.filter(p => p.statut === "SIGNALEE").length;
  const pannesResolues = pannes.filter(p => p.statut === "DECISION_REPARATION" || p.statut === "DECISION_REMPLACEMENT").length;

  const demandesTotal = demandes.length;

  const topPannes = [...pannes]
    .sort((a, b) => new Date(b.dateSignalement).getTime() - new Date(a.dateSignalement).getTime())
    .slice(0, 5);

  const topNotifications = [...notifications]
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
    .slice(0, 5);

  const animUnread = useCountUp(unreadCount);
  const animPannes = useCountUp(pannesTotal);
  const animDemandes = useCountUp(demandesTotal);
  const animResolues = useCountUp(pannesResolues);

  const timeStr = refreshedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const getPanneBadgeStyles = (statut: string) => {
    if (statut === "SIGNALEE") return "bg-orange-100 text-orange-700";
    if (statut === "EN_COURS") return "bg-blue-100 text-blue-700";
    if (statut === "DECISION_REPARATION" || statut === "DECISION_REMPLACEMENT") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

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
            <h1 className="sp-title">Espace Enseignant</h1>
            <p className="sp-subtitle">Consultez vos demandes en cours et l'état de votre matériel</p>
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
            label="Messages en attente"
            value={animUnread}
            icon={<IconBell />}
            color="#3b82f6"
            trend="Notifications non lues"
            trendUp={false}
            loading={loading}
          />
          <KpiCard
            label="Pannes signalées"
            value={animPannes}
            icon={<IconWrench />}
            color="#f59e0b"
            trend={pannesSignalees > 0 ? `${pannesSignalees} signalée(s)` : "Aucune signalée"}
            trendUp={pannesSignalees > 0}
            loading={loading}
            trendClassOverride={pannesSignalees > 0 ? "text-orange-500 bg-orange-100" : undefined}
          />
          <KpiCard
            label="En attente de vos besoins"
            value={animDemandes}
            icon={<IconDocument />}
            color="#8b5cf6"
            trend="Demandes ouvertes"
            trendUp={false}
            loading={loading}
          />
          <KpiCard
            label="Traitées par le responsable"
            value={animResolues}
            icon={<IconCheck />}
            color="#10b981"
            trend="Pannes résolues"
            trendUp={true}
            loading={loading}
          />
        </div>

        <div className="sp-charts-row" style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
          
          {/* Bloc Gauche - Mes dernières pannes */}
          <div className="sp-card sp-card--list" style={{ minHeight: "350px", overflow: "hidden" }}>
            <div className="sp-card-header">
              <h2 className="sp-card-title">Mes dernières pannes</h2>
              <span className="sp-card-badge">{topPannes.length} affichées</span>
            </div>
            <div className="overflow-x-auto w-full mt-4">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Chargement...</div>
              ) : topPannes.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">Aucune panne signalée pour le moment.</div>
              ) : (
                <table className="w-full text-left" style={{ fontSize: "0.85rem" }}>
                  <thead className="border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 pb-3 font-semibold">Inventaire</th>
                      <th className="px-4 pb-3 font-semibold">Matériel</th>
                      <th className="px-4 pb-3 font-semibold">Département</th>
                      <th className="px-4 pb-3 font-semibold">Signalement</th>
                      <th className="px-4 pb-3 font-semibold text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topPannes.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-blue-600 font-bold tracking-tight">{p.numeroInventaire}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900 mb-0.5">{p.typeMateriel}</div>
                          <div className="text-[10px] uppercase tracking-wider text-gray-500">{p.marque}</div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-700">{p.departementNom}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {p.dateSignalement ? new Date(p.dateSignalement).toLocaleDateString("fr-FR") : "--"}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded ${getPanneBadgeStyles(p.statut)}`}>
                            {p.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Bloc Droite - Notifications */}
          <div className="sp-card sp-card--list" style={{ minHeight: "350px", overflow: "hidden" }}>
            <div className="sp-card-header">
              <h2 className="sp-card-title text-blue-600">Mes dernières notifications</h2>
              <span className="sp-card-badge bg-blue-50 text-blue-600 border-blue-100">{topNotifications.length} affichées</span>
            </div>
            <div className="sp-user-list mt-6 space-y-3">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Chargement...</div>
              ) : topNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">Aucune notification pour le moment.</div>
              ) : (
                topNotifications.map(n => (
                  <div key={n.id} className={`sp-user-row border rounded-xl p-3.5 flex gap-4 items-center ${n.lu ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'}`}>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ring-1 shrink-0 ${n.lu ? 'bg-gray-50 text-gray-400 ring-gray-200' : 'bg-blue-100 text-blue-600 ring-blue-200'}`}>
                       <IconBell width={16} height={16} />
                     </div>
                     <div className="min-w-0 flex-1">
                       <div className={`font-medium text-[13px] mb-1 line-clamp-2 ${n.lu ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                         {n.message}
                       </div>
                       <div className="text-[11px] text-gray-500 leading-relaxed font-medium">
                         {n.dateCreation ? new Date(n.dateCreation).toLocaleDateString("fr-FR", { hour: '2-digit', minute: '2-digit' }) : "--"} 
                         &nbsp;•&nbsp; 
                         <span className={n.lu ? 'text-gray-400' : 'text-blue-600 font-bold'}>{n.lu ? 'Lue' : 'Non lue'}</span>
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
const IconBell = ({ width=24, height=24 }: { width?: number; height?: number }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconCheck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IconWrench = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
