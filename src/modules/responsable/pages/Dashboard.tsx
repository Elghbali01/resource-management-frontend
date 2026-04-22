import { useEffect, useState } from "react";
import { responsableService } from "../services/responsableService";
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

export default function ResponsableDashboard() {
  const [appels, setAppels] = useState<any[]>([]);
  const [ressources, setRessources] = useState<any[]>([]);
  const [pannes, setPannes] = useState<any[]>([]);
  const [fournisseurs, setFournisseurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<Date>(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const [app, res, pan, fou] = await Promise.all([
        responsableService.getAppelsOffre(),
        responsableService.getRessources(),
        responsableService.getMaintenancePannes(),
        responsableService.getFournisseurs()
      ]);
      setAppels(app);
      setRessources(res);
      setPannes(pan);
      setFournisseurs(fou);
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
  const appelsTotal = appels.length;
  const appelsOuverts = appels.filter(a => a.statut === "OUVERT").length;

  const offresEnAttente = appels.reduce((sum, a) => sum + (a.nombreLignes || 0), 0);

  const resTotal = ressources.length;
  const resDispo = ressources.filter(r => r.statut === "DISPONIBLE").length;
  const resAff = ressources.filter(r => r.statut === "AFFECTEE").length;

  const pannesTotal = pannes.filter(p => p.statut === "CONSTAT_ENVOYE").length;

  const fourBlacklist = fournisseurs.filter(f => f.blacklisted);

  const topRessources = [...ressources]
    .sort((a, b) => new Date(b.dateLivraison).getTime() - new Date(a.dateLivraison).getTime())
    .slice(0, 5);

  const animTotalAppels = useCountUp(appelsTotal);
  const animLignes = useCountUp(offresEnAttente);
  const animRes = useCountUp(resTotal);
  const animPannes = useCountUp(pannesTotal);

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
            <h1 className="sp-title">Responsable Ressources</h1>
            <p className="sp-subtitle">Vue d'ensemble des acquisitions et affectations</p>
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
            label="Appels d'offres"
            value={animTotalAppels}
            icon={<IconDocument />}
            color="#3b82f6"
            trend={appelsOuverts > 0 ? `${appelsOuverts} ouverts` : "0 ouvert"}
            trendUp={appelsOuverts > 0}
            loading={loading}
          />
          <KpiCard
            label="Lignes à traiter"
            value={animLignes}
            icon={<IconClock />}
            color="#f59e0b"
            trend="Offres en attente"
            trendUp={false}
            loading={loading}
          />
          <KpiCard
            label="Inventaire total"
            value={animRes}
            icon={<IconBox />}
            color="#10b981"
            trend={`${resDispo} disp. / ${resAff} aff.`}
            trendUp={true}
            loading={loading}
          />
          <KpiCard
            label="Constats en attente de décision"
            value={animPannes}
            icon={<IconWrench />}
            color="#e85d26"
            trend="Pannes à traiter"
            trendUp={pannesTotal === 0}
            loading={loading}
          />
        </div>

        <div className="sp-charts-row" style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
          
          {/* Bloc Gauche - Ressources */}
          <div className="sp-card sp-card--list" style={{ minHeight: "350px", overflow: "hidden" }}>
            <div className="sp-card-header">
              <h2 className="sp-card-title">Dernières ressources reçues</h2>
              <span className="sp-card-badge">{topRessources.length} affichées</span>
            </div>
            <div className="overflow-x-auto w-full mt-4">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Chargement...</div>
              ) : topRessources.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">Aucune ressource disponible.</div>
              ) : (
                <table className="w-full text-left" style={{ fontSize: "0.85rem" }}>
                  <thead className="border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 pb-3 font-semibold">Inventaire</th>
                      <th className="px-4 pb-3 font-semibold">Matériel</th>
                      <th className="px-4 pb-3 font-semibold">Société</th>
                      <th className="px-4 pb-3 font-semibold">Livraison</th>
                      <th className="px-4 pb-3 font-semibold text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topRessources.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-blue-600 font-bold tracking-tight">{r.numeroInventaire}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900 mb-0.5">{r.typeMateriel}</div>
                          <div className="text-[10px] uppercase tracking-wider text-gray-500">{r.marque}</div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-700">{r.nomSociete}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {r.dateLivraison ? new Date(r.dateLivraison).toLocaleDateString("fr-FR") : "--"}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded ${r.statut === 'DISPONIBLE' ? 'bg-green-100 text-green-700' : r.statut === 'AFFECTEE' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                            {r.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Bloc Droite - Blacklist */}
          <div className="sp-card sp-card--list" style={{ minHeight: "350px", overflow: "hidden" }}>
            <div className="sp-card-header">
              <h2 className="sp-card-title text-red-400">Fournisseurs blacklistés</h2>
              <span className="sp-card-badge bg-red-500/20 text-red-300 border-red-500/30">{fourBlacklist.length} total</span>
            </div>
            <div className="sp-user-list mt-6 space-y-3">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Chargement...</div>
              ) : fourBlacklist.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">Aucun fournisseur blacklisté.</div>
              ) : (
                fourBlacklist.map(f => {
                  const initiales = f.nomSociete ? f.nomSociete.substring(0, 2).toUpperCase() : "??";
                  const motif = f.blacklistMotif || "";
                  const tronque = motif.length > 60 ? motif.substring(0, 60) + "..." : motif;
                  return (
                    <div key={f.fournisseurId} className="sp-user-row bg-red-50 border border-red-100 rounded-xl p-3.5 flex gap-4 items-center">
                       <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm ring-1 ring-red-200 shrink-0">
                         {initiales}
                       </div>
                       <div className="min-w-0 flex-1">
                         <div className="font-bold text-red-900 text-[13px] mb-1 truncate">{f.nomSociete}</div>
                         <div className="text-[11px] text-red-700 leading-relaxed font-medium">{tronque}</div>
                       </div>
                    </div>
                  )
                })
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
  label, value, icon, color, trend, trendUp, loading,
}: {
  label: string; value: number; icon: React.ReactNode; color: string;
  trend: string; trendUp: boolean; loading: boolean;
}) {
  return (
    <div className="sp-kpi-card relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" style={{ background: color + '20' }} />
      <div className="sp-kpi-top relative z-10">
        <div className="sp-kpi-icon" style={{ background: `${color}20`, color, boxShadow: `0 0 15px ${color}30` }}>
          {icon}
        </div>
        <span className={`sp-kpi-trend ${trendUp ? "sp-kpi-trend--up" : "sp-kpi-trend--warn"}`}>
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
const IconClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconBox = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IconWrench = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
