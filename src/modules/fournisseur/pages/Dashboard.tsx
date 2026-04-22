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

export default function FournisseurDashboard() {
  const [appels, setAppels] = useState<any[]>([]);
  const [offres, setOffres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<Date>(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const [appRes, offRes] = await Promise.all([
        api.get("/fournisseurs/appels-offre").then(r => r.data),
        api.get("/fournisseurs/offres/mes-offres").then(r => r.data)
      ]);
      setAppels(appRes || []);
      setOffres(offRes || []);
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
  const appelsOuverts = appels.filter(a => a.statut === "OUVERT").length;
  const mesOffresTotal = offres.length;
  const offresAcceptees = offres.filter(o => o.statut === "ACCEPTEE").length;
  const offresRejetees = offres.filter(o => o.statut === "REJETEE" || o.statut === "ELIMINEE").length;

  const topAppels = appels
    .filter(a => a.statut === "OUVERT")
    .slice(0, 5);

  const topOffres = [...offres]
    .sort((a, b) => new Date(b.dateSoumission).getTime() - new Date(a.dateSoumission).getTime())
    .slice(0, 5);

  const animOuverts = useCountUp(appelsOuverts);
  const animMesOffres = useCountUp(mesOffresTotal);
  const animAcceptees = useCountUp(offresAcceptees);
  const animRejetees = useCountUp(offresRejetees);

  const timeStr = refreshedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const getOffreBadgeStyles = (statut: string) => {
    if (statut === "ACCEPTEE") return "bg-green-100 text-green-700 border-green-200";
    if (statut === "SOUMISE") return "bg-blue-100 text-blue-700 border-blue-200";
    if (statut === "REJETEE" || statut === "ELIMINEE") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
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
            <h1 className="sp-title">Espace Fournisseur</h1>
            <p className="sp-subtitle">Consultez les appels d'offres et suivez vos soumissions</p>
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
            label="Disponibles à soumission"
            value={animOuverts}
            icon={<IconDocument />}
            color="#3b82f6"
            trend="Appels d'offres ouverts"
            trendUp={true}
            loading={loading}
          />
          <KpiCard
            label="Propositions envoyées"
            value={animMesOffres}
            icon={<IconSend />}
            color="#8b5cf6"
            trend="Mes offres soumises"
            trendUp={true}
            loading={loading}
          />
          <KpiCard
            label="Contrats remportés"
            value={animAcceptees}
            icon={<IconCheck />}
            color="#10b981"
            trend="Offres acceptées"
            trendUp={true}
            loading={loading}
          />
          <KpiCard
            label="Non retenues"
            value={animRejetees}
            icon={<IconX />}
            color="#ef4444"
            trend="Offres rejetées"
            trendUp={false}
            loading={loading}
          />
        </div>

        <div className="sp-charts-row" style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
          
          {/* Bloc Gauche - Appels ouverts */}
          <div className="sp-card sp-card--list" style={{ minHeight: "350px", overflow: "hidden" }}>
            <div className="sp-card-header">
              <h2 className="sp-card-title">Appels d'offres ouverts</h2>
              <span className="sp-card-badge">{topAppels.length} affichés</span>
            </div>
            <div className="overflow-x-auto w-full mt-4">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Chargement...</div>
              ) : topAppels.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">Aucun appel d'offres ouvert.</div>
              ) : (
                <table className="w-full text-left" style={{ fontSize: "0.85rem" }}>
                  <thead className="border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 pb-3 font-semibold">Titre</th>
                      <th className="px-4 pb-3 font-semibold text-center">Lignes</th>
                      <th className="px-4 pb-3 font-semibold">Calendrier</th>
                      <th className="px-4 pb-3 font-semibold text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topAppels.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-900">{a.titre}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center min-w-[2rem] px-1.5 py-0.5 text-xs font-bold text-blue-700 bg-blue-100 rounded-full">{a.nombreLignes}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-[11px] leading-relaxed">
                          Du <span className="font-semibold text-gray-700">{new Date(a.dateDebut).toLocaleDateString("fr-FR")}</span>
                          <br />
                          Au <span className="font-semibold text-gray-700">{new Date(a.dateFin).toLocaleDateString("fr-FR")}</span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded bg-green-100 text-green-700 border border-green-200">
                            OUVERT
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Bloc Droite - Mes dernières offres */}
          <div className="sp-card sp-card--list" style={{ minHeight: "350px", overflow: "hidden" }}>
            <div className="sp-card-header">
              <h2 className="sp-card-title text-purple-600">Mes dernières offres</h2>
              <span className="sp-card-badge bg-purple-50 text-purple-600 border-purple-100">{topOffres.length} affichées</span>
            </div>
            <div className="sp-user-list mt-6 space-y-3">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Chargement...</div>
              ) : topOffres.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">Aucune offre soumise pour le moment.</div>
              ) : (
                topOffres.map(o => (
                  <div key={o.id} className="sp-user-row bg-white border border-gray-100 rounded-xl p-3.5 flex gap-4 items-center">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ring-1 shrink-0 ${o.statut === 'ACCEPTEE' ? 'bg-green-100 text-green-600 ring-green-200' : o.statut === 'REJETEE' || o.statut === 'ELIMINEE' ? 'bg-red-100 text-red-600 ring-red-200' : 'bg-blue-100 text-blue-600 ring-blue-200'}`}>
                       <IconSend width={16} height={16} />
                     </div>
                     <div className="min-w-0 flex-1">
                       <div className="font-bold text-gray-900 text-[13px] mb-1 truncate" title={o.appelOffreTitre}>{o.appelOffreTitre}</div>
                       <div className="text-[11px] text-gray-500 font-medium flex items-center gap-2">
                         <span className="font-mono text-gray-700 font-bold">{o.montantTotal?.toLocaleString("fr-FR", {style: "currency", currency: "MAD"})}</span>
                         • 
                         <span className={`inline-block px-1.5 py-0.5 uppercase tracking-wider font-bold border rounded ${getOffreBadgeStyles(o.statut)}`}>
                           {o.statut}
                         </span>
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
const IconCheck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IconSend = ({ width=24, height=24 }: { width?: number; height?: number }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IconX = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
