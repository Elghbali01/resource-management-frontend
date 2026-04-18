import React, { useEffect, useState } from "react";
import { panneService } from "../services/panneService";
import type { PanneResponse } from "../../../types/panne";

export default function EnseignantPannesPage() {
  const [pannes, setPannes] = useState<PanneResponse[]>([]);
  const [ressources, setRessources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ressourceId: 0,
    descriptionSignalement: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [pannesData, resData] = await Promise.all([
        panneService.getMesPannes(),
        panneService.getMesRessources().catch(() => []) 
      ]);
      setPannes(pannesData);
      setRessources(resData);
    } catch (err: any) {
      setErrorMsg("Impossible de charger vos données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ressourceId || !formData.descriptionSignalement.trim()) {
      setErrorMsg("Veuillez sélectionner une ressource et fournir une description.");
      return;
    }
    try {
      setErrorMsg("");
      await panneService.signalerPanne(formData);
      setSuccessMsg("Signalement envoyé avec succès.");
      setFormData({ ressourceId: 0, descriptionSignalement: "" });
      setShowForm(false);
      loadData();
    } catch (err: any) {
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || "Une erreur est survenue lors du signalement.";
      setErrorMsg(apiMessage);
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Signaler une Panne</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les pannes pour les ressources qui vous sont affectées.</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? "Annuler le signalement" : "+ Signaler une panne"}
        </button>
      </div>

      {errorMsg && <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">{errorMsg}</div>}
      {successMsg && <div className="p-4 mb-6 bg-green-50 text-green-700 border border-green-200 rounded-lg shadow-sm">{successMsg}</div>}

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 mb-8 mt-2">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Nouveau Signalement</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ressource défectueuse *</label>
              <select
                required
                value={formData.ressourceId}
                onChange={e => setFormData({ ...formData, ressourceId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:border-blue-300"
              >
                <option value={0} disabled>-- Choisir une ressource affectée --</option>
                {ressources.map(r => (
                  <option key={r.id} value={r.id}>
                    [{r.numeroInventaire}] {r.marque} {r.typeMateriel}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description du problème *</label>
              <textarea
                required
                rows={3}
                placeholder="L'ordinateur ne démarre plus, l'écran clignote..."
                value={formData.descriptionSignalement}
                onChange={e => setFormData({ ...formData, descriptionSignalement: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:border-blue-300"
              ></textarea>
            </div>
            <div className="flex justify-end pt-3">
              <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">Envoyer le signalement</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border text-sm border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading && pannes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : pannes.length === 0 ? (
          <div className="p-12 text-center text-gray-500 italic">Aucune panne signalée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ressource</th>
                  <th className="px-4 py-3 font-semibold">Signalement</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Décision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pannes.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs font-bold text-gray-800">{p.numeroInventaire}</div>
                      <div className="text-[11px] text-gray-500 mt-1">{p.typeMateriel} {p.marque}</div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 text-[13px]">{p.descriptionSignalement}</p>
                      <p className="text-xs text-gray-500 mt-1">Le {new Date(p.dateSignalement).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold ${
                        p.statut === "SIGNALEE" ? "bg-amber-100 text-amber-800" 
                        : p.statut === "EN_COURS" ? "bg-blue-100 text-blue-800"
                        : p.statut === "CONSTAT_ENVOYE" ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                      }`}>
                        {p.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.decisionResponsable ? (
                        <div>
                          <div className="font-semibold text-xs text-indigo-700">{p.decisionResponsable}</div>
                          {p.motifDecisionResponsable && <div className="text-[10px] text-gray-500 mt-0.5 max-w-[150px] truncate" title={p.motifDecisionResponsable}>{p.motifDecisionResponsable}</div>}
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">En attente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
