import React, { useEffect, useState } from "react";
import { technicienService } from "../services/technicienService";
import type { PanneResponse } from "../../../types/panne";

export default function InterventionsPage() {
  const [pannes, setPannes] = useState<PanneResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [activeIntervention, setActiveIntervention] = useState<number | null>(null);
  const [interventionComment, setInterventionComment] = useState("");

  const [activeConstat, setActiveConstat] = useState<PanneResponse | null>(null);
  const [constatForm, setConstatForm] = useState({
    explicationPanne: "",
    dateApparition: "",
    frequence: "RARE",
    ordrePanne: "LOGICIEL",
    severe: true
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await technicienService.getPannes();
      setPannes(data);
    } catch (err: any) {
      setErrorMsg("Impossible de charger les pannes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCommencerIntervention = async (panneId: number) => {
    if (!interventionComment.trim()) {
      setErrorMsg("Veuillez saisir un commentaire initial pour commencer.");
      return;
    }
    try {
      setErrorMsg("");
      await technicienService.commencerIntervention(panneId, interventionComment);
      setSuccessMsg("L'intervention a débuté avec succès.");
      setInterventionComment("");
      setActiveIntervention(null);
      loadData();
    } catch (err: any) {
      const msg = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors du début de l'intervention.";
      setErrorMsg(msg);
    }
  };

  const handleRedigerConstat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConstat) return;

    try {
      setErrorMsg("");
      let payload = { ...constatForm };
      
      // Règle UI importante: Imprimante = MATERIEL
      if (activeConstat.typeMateriel === "IMPRIMANTE") {
        payload.ordrePanne = "MATERIEL";
      }

      await technicienService.redigerConstat(activeConstat.id, payload);
      setSuccessMsg("Constat envoyé avec succès.");
      setActiveConstat(null);
      loadData();
    } catch (err: any) {
      const msg = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors de l'envoi du constat.";
      setErrorMsg(msg);
    }
  };

  const openConstatModal = (panne: PanneResponse) => {
    setActiveConstat(panne);
    setConstatForm({
      explicationPanne: "",
      dateApparition: new Date().toISOString().split("T")[0],
      frequence: "RARE",
      ordrePanne: panne.typeMateriel === "IMPRIMANTE" ? "MATERIEL" : "LOGICIEL",
      severe: true
    });
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Interventions Techniques</h1>
        <p className="text-sm text-gray-500 mt-1">Prenez en charge les pannes et rédigez les constats d'expertise.</p>
      </div>

      {errorMsg && <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">{errorMsg}</div>}
      {successMsg && <div className="p-4 mb-6 bg-green-50 text-green-700 border border-green-200 rounded-lg shadow-sm">{successMsg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-gray-500">Chargement...</div>
        ) : pannes.length === 0 ? (
          <div className="col-span-full p-12 text-center text-gray-500 italic bg-white rounded-2xl">Aucune panne à traiter.</div>
        ) : (
          pannes.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                    p.statut === "SIGNALEE" ? "bg-amber-100 text-amber-800" 
                    : p.statut === "EN_COURS" ? "bg-blue-100 text-blue-800"
                    : p.statut === "CONSTAT_ENVOYE" ? "bg-purple-100 text-purple-800"
                    : "bg-green-100 text-green-800"
                  }`}>
                    {p.statut.replace("_", " ")}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(p.dateSignalement).toLocaleDateString()}</span>
                </div>
                
                <h3 className="font-bold text-gray-900 leading-tight mb-1">
                  [{p.numeroInventaire}] {p.typeMateriel} {p.marque}
                </h3>
                <p className="text-xs text-indigo-600 font-medium mb-3">Signalé par: {p.enseignantNom} {p.enseignantPrenom} ({p.departementNom})</p>
                
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100 mb-4">
                  <strong className="block text-[10px] uppercase text-gray-500 mb-1">PROBLÈME DÉCLARÉ</strong>
                  {p.descriptionSignalement}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                {p.statut === "SIGNALEE" && (
                  activeIntervention === p.id ? (
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="Commentaire de diagnostique initial" 
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-blue-500"
                        value={interventionComment}
                        onChange={e => setInterventionComment(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleCommencerIntervention(p.id)} className="flex-1 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">Valider</button>
                        <button onClick={() => setActiveIntervention(null)} className="flex-1 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200">Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setActiveIntervention(p.id)} className="w-full py-2 bg-blue-50 text-blue-700 border border-blue-100 text-sm font-bold rounded-lg hover:bg-blue-100 transition">
                      Prendre en charge
                    </button>
                  )
                )}

                {p.statut === "EN_COURS" && (
                  <button onClick={() => openConstatModal(p)} className="w-full py-2 bg-purple-50 text-purple-700 border border-purple-100 text-sm font-bold rounded-lg hover:bg-purple-100 transition">
                    Rédiger un Constat
                  </button>
                )}

                {(p.statut === "CONSTAT_ENVOYE" || p.statut === "DECISION_REPARATION" || p.statut === "DECISION_REMPLACEMENT") && (
                  <div className="text-center py-2">
                    <span className="text-xs text-gray-500 italic block mb-1">Expertise terminée.</span>
                    {p.decisionResponsable && (
                      <span className="text-xs font-bold text-indigo-700">Décision: {p.decisionResponsable.replace("_", " ")}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {activeConstat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Rédiger un Constat</h2>
            <p className="text-sm text-gray-500 mb-6">Expertise pour la ressource {activeConstat.typeMateriel} ({activeConstat.numeroInventaire})</p>
            
            <form onSubmit={handleRedigerConstat} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Explication technique *</label>
                <textarea 
                  required rows={3}
                  value={constatForm.explicationPanne}
                  onChange={e => setConstatForm({...constatForm, explicationPanne: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:border-purple-300 focus:outline-none"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'apparition *</label>
                  <input 
                    type="date" required
                    value={constatForm.dateApparition}
                    onChange={e => setConstatForm({...constatForm, dateApparition: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence *</label>
                  <select 
                    value={constatForm.frequence}
                    onChange={e => setConstatForm({...constatForm, frequence: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-300 focus:outline-none"
                  >
                    <option value="RARE">Rare</option>
                    <option value="FREQUENTE">Fréquente</option>
                    <option value="PERMANENTE">Permanente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de Panne *</label>
                  <select 
                    value={constatForm.ordrePanne}
                    onChange={e => setConstatForm({...constatForm, ordrePanne: e.target.value})}
                    disabled={activeConstat.typeMateriel === "IMPRIMANTE"}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-300 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="LOGICIEL">Logiciel</option>
                    <option value="MATERIEL">Matériel</option>
                  </select>
                  {activeConstat.typeMateriel === "IMPRIMANTE" && (
                    <p className="text-[10px] text-gray-500 mt-1 italic">Imprimante sélectionnée: Matériel forcé.</p>
                  )}
                </div>
                
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={constatForm.severe}
                      onChange={e => setConstatForm({...constatForm, severe: e.target.checked})}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm font-bold text-red-600">Panne Sévère</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setActiveConstat(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold shadow-md shadow-purple-600/20 transition">
                  Envoyer Constat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
