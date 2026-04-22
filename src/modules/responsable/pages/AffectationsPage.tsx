import { useEffect, useState } from "react";
import { responsableService } from "../services/responsableService";
import type { AffectationRessourceResponse, CreateAffectationRequest } from "../../../types/ressource";
import type { RessourceResponse } from "../../../types/ressource";

export default function AffectationsPage() {
  const [affectations, setAffectations] = useState<AffectationRessourceResponse[]>([]);
  const [inventaire, setInventaire] = useState<RessourceResponse[]>([]); // To select available ressources
  const [departements, setDepartements] = useState<any[]>([]);
  const [enseignants, setEnseignants] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Formulaire Nouvelle Affectation
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<CreateAffectationRequest>({
    ressourceId: 0,
    departementId: 0,
    enseignantId: undefined,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [affData, resData, depData] = await Promise.all([
        responsableService.getAffectations(),
        responsableService.getRessources(),
        responsableService.getDepartements()
      ]);
      setAffectations(affData);
      setInventaire(resData);
      setDepartements(depData);
    } catch (err: any) {
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || "Impossible de charger les affectations.";
      setErrorMsg(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (addForm.departementId) {
      responsableService.getEnseignantsByDepartement(addForm.departementId)
        .then(setEnseignants)
        .catch(err => console.error("Erreur chargement enseignants", err));
    } else {
      setEnseignants([]);
    }
  }, [addForm.departementId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.ressourceId || !addForm.departementId) {
      setErrorMsg("Veuillez sélectionner une ressource et un département.");
      return;
    }

    try {
      setProcessingId(-1);
      setErrorMsg("");
      setSuccessMsg("");
      await responsableService.createAffectation({
        ...addForm,
        enseignantId: addForm.enseignantId ? Number(addForm.enseignantId) : null
      });
      setSuccessMsg("L'affectation a été créée avec succès.");
      setShowAddForm(false);
      setAddForm({ ressourceId: 0, departementId: 0, enseignantId: undefined });
      loadData();
    } catch (err: any) {
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors de la création de l'affectation.";
      setErrorMsg(apiMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette affectation ? La ressource redeviendra DISPONIBLE.")) return;
    try {
      setProcessingId(id);
      setErrorMsg("");
      setSuccessMsg("");
      await responsableService.deleteAffectation(id);
      setSuccessMsg("L'affectation a été annulée/supprimée.");
      loadData();
    } catch (err: any) {
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors de la suppression de l'affectation.";
      setErrorMsg(apiMessage);
    } finally {
      setProcessingId(null);
    }
  };

  // Les ressources disponibles pour le select (Statut DISPONIBLE)
  const ressourcesDisponibles = inventaire.filter(r => r.statut === "DISPONIBLE");

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affectations des Ressources</h1>
          <p className="text-sm text-gray-500 mt-1">Assignez le matériel inventorié aux départements et enseignants.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          {showAddForm ? "Annuler l'attribution" : "+ Nouvelle Affectation"}
        </button>
      </div>

      {errorMsg && <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">{errorMsg}</div>}
      {successMsg && <div className="p-4 mb-6 bg-green-50 text-green-700 border border-green-200 rounded-lg shadow-sm">{successMsg}</div>}

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 mb-8 mt-2">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Attribuer une Ressource</h2>
          <form onSubmit={handleAdd} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cibler une ressource *</label>
                <select 
                  required
                  value={addForm.ressourceId} 
                  onChange={e => setAddForm({...addForm, ressourceId: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:border-blue-300"
                >
                  <option value={0} disabled>-- Choisir une ressource disponible --</option>
                  {ressourcesDisponibles.map(r => (
                    <option key={r.id} value={r.id}>
                      [{r.numeroInventaire}] {r.typeMateriel} {r.marque} {r.codeBarres ? `| CB: ${r.codeBarres}` : ""}
                    </option>
                  ))}
                </select>
                {ressourcesDisponibles.length === 0 && <p className="text-xs text-red-500 mt-1">Aucune ressource disponible dans l'inventaire.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
                <select 
                  required
                  value={addForm.departementId || ""}
                  onChange={e => setAddForm({...addForm, departementId: Number(e.target.value), enseignantId: undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:border-blue-300"
                >
                  <option value="" disabled>-- Choisir un département --</option>
                  {departements.map(d => (
                    <option key={d.id} value={d.id}>{d.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant <span className="text-gray-400 font-normal">(Optionnel)</span></label>
                <select 
                  value={addForm.enseignantId || ""}
                  onChange={e => setAddForm({...addForm, enseignantId: e.target.value ? Number(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring focus:border-blue-300"
                  disabled={!addForm.departementId}
                >
                  <option value="">-- Tout le département --</option>
                  {enseignants.map(e => (
                    <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1 italic">Si vide = affectation collective au département.</p>
              </div>
            </div>
            
            <div className="flex justify-end pt-3">
              <button type="submit" disabled={processingId === -1 || ressourcesDisponibles.length === 0} className="px-5 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50">Confirmer l'affectation</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border text-sm border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading && affectations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chargement du registre...</div>
        ) : affectations.length === 0 ? (
          <div className="p-12 text-center text-gray-500 italic">Aucune affectation réalisée à ce jour.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Identité Ressource</th>
                  <th className="px-4 py-3 font-semibold">Bénéficiaire & Date</th>
                  <th className="px-4 py-3 font-semibold">Type Affectation</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {affectations.map(aff => (
                  <tr key={aff.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs font-bold text-gray-800">{aff.numeroInventaire}</div>
                      <div className="text-[11px] text-gray-500 mt-1">CB: {aff.codeBarres}</div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900 text-sm">
                        {aff.typeBeneficiaire === "ENSEIGNANT" ? `${aff.enseignantNom} ${aff.enseignantPrenom}` : aff.departementNom}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Le {new Date(aff.dateAffectation).toLocaleDateString()}</p>
                      {aff.typeBeneficiaire === "ENSEIGNANT" && <p className="text-[10px] text-gray-400 mt-0.5">Dépt: {aff.departementNom}</p>}
                    </td>

                    <td className="px-4 py-3 align-middle">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold ${
                        aff.typeBeneficiaire === "ENSEIGNANT" ? "bg-cyan-100 text-cyan-700" : "bg-indigo-100 text-indigo-700"
                      }`}>
                        {aff.typeBeneficiaire}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(aff.id)} disabled={processingId === aff.id} className="px-2 py-1 text-[11px] font-medium border border-red-200 text-red-600 rounded hover:bg-red-50 transition">
                        Retirer
                      </button>
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
