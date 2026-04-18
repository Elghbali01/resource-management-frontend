import React, { useEffect, useState } from "react";
import { responsableService } from "../services/responsableService";
import type { PanneResponse } from "../../../types/panne";

export default function MaintenancePage() {
  const [pannes, setPannes] = useState<PanneResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [activeDecision, setActiveDecision] = useState<PanneResponse | null>(null);
  const [decisionForm, setDecisionForm] = useState({
    decision: "REPARATION_FOURNISSEUR",
    motif: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await responsableService.getMaintenancePannes();
      setPannes(data);
    } catch (err: any) {
      setErrorMsg("Impossible de charger le registre de maintenance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDecision) return;

    if (!decisionForm.motif.trim()) {
      setErrorMsg("Veuillez fournir un motif pour la décision.");
      return;
    }

    try {
      setErrorMsg("");
      await responsableService.prendreDecisionMaintenance(activeDecision.id, decisionForm);
      setSuccessMsg("La décision a été enregistrée et notifiée au fournisseur.");
      setActiveDecision(null);
      loadData();
    } catch (err: any) {
      const msg = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors de la prise de décision.";
      setErrorMsg(msg);
    }
  };

  const openDecisionModal = (panne: PanneResponse) => {
    setActiveDecision(panne);
    setDecisionForm({
      decision: "REPARATION_FOURNISSEUR",
      motif: ""
    });
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance et Garantie</h1>
        <p className="text-sm text-gray-500 mt-1">Consultez les constats techniques et prenez des décisions avec les fournisseurs.</p>
      </div>

      {errorMsg && <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">{errorMsg}</div>}
      {successMsg && <div className="p-4 mb-6 bg-green-50 text-green-700 border border-green-200 rounded-lg shadow-sm">{successMsg}</div>}

      <div className="bg-white border text-sm border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : pannes.length === 0 ? (
          <div className="p-12 text-center text-gray-500 italic">Aucun dossier de maintenance actuel.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ressource</th>
                  <th className="px-4 py-3 font-semibold">Diagnostic Technicien</th>
                  <th className="px-4 py-3 font-semibold">Garantie & Statut</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pannes.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 align-top min-w-[200px]">
                      <div className="font-mono text-xs font-bold text-gray-800">{p.numeroInventaire}</div>
                      <div className="text-[12px] font-medium text-gray-900 mt-0.5">{p.typeMateriel} {p.marque}</div>
                      <div className="text-[10px] text-gray-500 mt-2">Dép: {p.departementNom} | Ens: {p.enseignantNom}</div>
                    </td>
                    
                    <td className="px-4 py-3 align-top min-w-[300px]">
                      {p.statut === "SIGNALEE" || p.statut === "EN_COURS" ? (
                        <div className="text-gray-500 italic text-xs">Examen technique en cours...</div>
                      ) : (
                        <div>
                          <div className="text-xs text-indigo-700 font-bold mb-1">Expertise: {p.ordrePanne} ({p.frequence})</div>
                          <p className="text-gray-700 text-xs mb-1">{p.explicationPanne}</p>
                          <div className="flex gap-2">
                            <span className="text-[10px] text-gray-500">Tech: {p.technicienPrenom} {p.technicienNom}</span>
                            {p.severe && <span className="text-[10px] bg-red-100 text-red-700 px-1 font-bold rounded">SÉVÈRE</span>}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="mb-2">
                        {p.garantieValide ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">Sous Garantie</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">Hors Garantie</span>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.statut === "CONSTAT_ENVOYE" ? "bg-purple-100 text-purple-800"
                        : p.statut === "DECISION_REPARATION" || p.statut === "DECISION_REMPLACEMENT" ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-100 text-gray-800"
                      }`}>
                        {p.statut.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-top text-right">
                      {p.statut === "CONSTAT_ENVOYE" && (
                        <button 
                          onClick={() => openDecisionModal(p)} 
                          className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded shadow-sm hover:bg-indigo-700 transition"
                        >
                          Décider
                        </button>
                      )}
                      
                      {(p.statut === "DECISION_REPARATION" || p.statut === "DECISION_REMPLACEMENT") && p.decisionResponsable && (
                        <div className="text-xs text-indigo-700 font-bold mt-1">
                          {p.decisionResponsable.replace("_", " ")}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeDecision && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Décision de Maintenance</h2>
            <p className="text-sm text-gray-500 mb-4">Pour : {activeDecision.typeMateriel} ({activeDecision.numeroInventaire})</p>
            
            {!activeDecision.garantieValide && (
              <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs border border-red-200 rounded-lg">
                <strong>Attention :</strong> Cet équipement n'est plus sous garantie. Une décision de réparation/remplacement peut engendrer des coûts supplémentaires.
              </div>
            )}

            <form onSubmit={handleDecision} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action Requise *</label>
                <select 
                  value={decisionForm.decision}
                  onChange={e => setDecisionForm({...decisionForm, decision: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:border-indigo-300 focus:outline-none"
                >
                  <option value="REPARATION_FOURNISSEUR">Réparation chez le Fournisseur</option>
                  <option value="REMPLACEMENT_FOURNISSEUR">Remplacement par le Fournisseur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif de la décision *</label>
                <textarea 
                  required rows={3}
                  value={decisionForm.motif}
                  onChange={e => setDecisionForm({...decisionForm, motif: e.target.value})}
                  placeholder="Expliquez la décision pour le bon de retour..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:border-indigo-300 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setActiveDecision(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md shadow-indigo-600/20 transition">
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
