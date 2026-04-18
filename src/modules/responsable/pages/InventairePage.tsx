import { useEffect, useState } from "react";
import { responsableService } from "../services/responsableService";
import type { RessourceResponse, UpdateRessourceRequest } from "../../../types/ressource";

export default function InventairePage() {
  const [ressources, setRessources] = useState<RessourceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<UpdateRessourceRequest>>({});
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadRessources = async () => {
    try {
      setLoading(true);
      const data = await responsableService.getRessources();
      setRessources(data);
    } catch (err: any) {
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || "Impossible de charger l'inventaire.";
      setErrorMsg(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRessources();
  }, []);

  const handleEdit = (r: RessourceResponse) => {
    setEditingId(r.id);
    setEditForm({
      typeMateriel: r.typeMateriel,
      marque: r.marque,
      caracteristiques: r.caracteristiques || ""
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      setProcessingId(editingId);
      setErrorMsg("");
      setSuccessMsg("");
      await responsableService.updateRessource(editingId, editForm);
      setSuccessMsg("Ressource mise à jour avec succès.");
      setEditingId(null);
      loadRessources();
    } catch (err: any) {
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors de la modification.";
      setErrorMsg(apiMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette ressource de l'inventaire ?")) return;
    try {
      setProcessingId(id);
      setErrorMsg("");
      setSuccessMsg("");
      await responsableService.deleteRessource(id);
      setSuccessMsg("Ressource supprimée de l'inventaire.");
      loadRessources();
    } catch (err: any) {
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors de la suppression.";
      setErrorMsg(apiMessage);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inventaire des Ressources</h1>
        <p className="text-sm text-gray-500 mt-1">Consultez et gérez les équipements physiques réceptionnés.</p>
      </div>

      {errorMsg && <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">{errorMsg}</div>}
      {successMsg && <div className="p-4 mb-6 bg-green-50 text-green-700 border border-green-200 rounded-lg shadow-sm">{successMsg}</div>}

      <div className="bg-white border text-sm border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading && ressources.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chargement de l'inventaire...</div>
        ) : ressources.length === 0 ? (
          <div className="p-12 text-center text-gray-500 italic">Aucune ressource inventoriée à ce jour.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Inventaire & Code Barres</th>
                  <th className="px-4 py-3 font-semibold">Identité Matériel</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Fournisseur & Arrivée</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ressources.map(res => (
                  <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs font-bold text-gray-800">{res.numeroInventaire}</div>
                      <div className="text-[11px] text-gray-500 mt-1">CB: {res.codeBarres}</div>
                    </td>
                    
                    <td className="px-4 py-3">
                      {editingId === res.id ? (
                        <div className="space-y-2">
                           <input type="text" value={editForm.typeMateriel} onChange={e => setEditForm({...editForm, typeMateriel: e.target.value})} className="w-full px-2 py-1 border rounded text-xs" placeholder="Type (Ex: ORDINATEUR)"/>
                           <input type="text" value={editForm.marque} onChange={e => setEditForm({...editForm, marque: e.target.value})} className="w-full px-2 py-1 border rounded text-xs" placeholder="Marque"/>
                           <input type="text" value={editForm.caracteristiques} onChange={e => setEditForm({...editForm, caracteristiques: e.target.value})} className="w-full px-2 py-1 border rounded text-xs" placeholder="Caractéristiques"/>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{res.typeMateriel} <span className="font-normal text-gray-600">({res.marque})</span></p>
                          <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[250px]" title={res.caracteristiques}>{res.caracteristiques || "Aucune caractéristique"}</p>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 align-middle">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold ${
                        res.statut === "DISPONIBLE" ? "bg-green-100 text-green-700" :
                        res.statut === "AFFECTEE" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {res.statut}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs text-gray-600">
                      <p className="font-medium text-gray-800">{res.nomSociete}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5" title="Date de livraison réelle">{new Date(res.dateLivraison).toLocaleDateString()}</p>
                    </td>

                    <td className="px-4 py-3 text-right">
                      {editingId === res.id ? (
                         <div className="flex justify-end gap-2">
                           <button onClick={() => setEditingId(null)} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Annuler</button>
                           <button onClick={handleSaveEdit} disabled={processingId === res.id} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Sauver</button>
                         </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(res)} className="px-2 py-1 text-[11px] font-medium border border-gray-300 text-gray-600 rounded hover:bg-gray-50">Modifier</button>
                          {res.statut === "DISPONIBLE" && (
                            <button onClick={() => handleDelete(res.id)} disabled={processingId === res.id} className="px-2 py-1 text-[11px] font-medium bg-red-50 text-red-600 rounded hover:bg-red-100">Sppr</button>
                          )}
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
    </div>
  );
}
