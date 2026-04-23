import { useState } from "react";
import type { AppelOffreResponse } from "../../../types/appelOffre";
import type { CreateOffreFournisseurRequest, CreateOffreLigneRequest, OffreFournisseurResponse } from "../../../types/offreFournisseur";
import { fournisseurService } from "../services/fournisseurService";

interface Props {
  appelOffre: AppelOffreResponse;
  onOffreSoumise?: (offre: OffreFournisseurResponse) => void;
}

export default function FournisseurAppelOffreDetail({ appelOffre, onOffreSoumise }: Props) {
  const [formData, setFormData] = useState<Record<number, Partial<CreateOffreLigneRequest>>>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLigneChange = (ligneId: number, field: keyof CreateOffreLigneRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [ligneId]: {
        ...prev[ligneId],
        [field]: value
      }
    }));
    setErrorMsg("");
  };

  const isFormValid = () => {
    if (!appelOffre.lignes || appelOffre.lignes.length === 0) return false;
    for (const ligne of appelOffre.lignes) {
      const data = formData[ligne.id];
      if (!data || !data.marque || !data.prixUnitaire || !data.dureeGarantieMois || !data.dateLivraisonPrevue) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      
      const payload: CreateOffreFournisseurRequest = {
        appelOffreId: appelOffre.id,
        lignes: appelOffre.lignes.map(l => ({
          appelOffreLigneId: l.id,
          marque: formData[l.id].marque!,
          prixUnitaire: Number(formData[l.id].prixUnitaire!),
          dureeGarantieMois: Number(formData[l.id].dureeGarantieMois!),
          dateLivraisonPrevue: formData[l.id].dateLivraisonPrevue!
        }))
      };

      const submitted = await fournisseurService.soumettreOffre(payload);
      setSuccessMsg("Votre offre commerciale a été soumise avec succès !");
      if (onOffreSoumise) {
        setTimeout(() => onOffreSoumise(submitted), 2000);
      }
    } catch (err: any) {
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors de la soumission de l'offre.";
      setErrorMsg(apiMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 bg-blue-50/30 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{appelOffre.titre}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>Publié le {new Date(appelOffre.dateCreation).toLocaleDateString("fr-FR")}</span>
            <span>•</span>
            <span className="font-medium text-blue-700">{appelOffre.nombreLignes} ligne(s) d'équipement</span>
          </p>
        </div>
      </div>

      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="grid grid-cols-2 gap-6 relative">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Période de Soumission</h3>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] text-gray-400">Ouverture</p>
                <p className="font-semibold text-gray-800">{new Date(appelOffre.dateDebut).toLocaleDateString("fr-FR")}</p>
              </div>
              <div className="w-8 border-t border-gray-300"></div>
              <div>
                <p className="text-[10px] text-gray-400">Clôture</p>
                <p className="font-semibold text-gray-800">{new Date(appelOffre.dateFin).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
          </div>
          {appelOffre.description && (
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Détails & Exigences</h3>
              <p className="text-sm text-gray-700">{appelOffre.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-0">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-gray-800">Spécifications Techniques Demandées</h3>
        </div>
        
        {appelOffre.lignes && appelOffre.lignes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-semibold">Service / Matériel</th>
                  <th className="px-4 py-3 font-semibold text-center">Qté</th>
                  <th className="px-4 py-3 font-semibold w-1/4">Proposition (Marque)</th>
                  <th className="px-4 py-3 font-semibold w-1/6">P.U (€)</th>
                  <th className="px-4 py-3 font-semibold w-1/6">Garantie (Mois)</th>
                  <th className="px-4 py-3 font-semibold w-1/6">Livraison</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appelOffre.lignes.map(ligne => (
                  <tr key={ligne.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      {ligne.typeAffectation === "ENSEIGNANT" ? (
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{ligne.departementNom}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[200px]">{ligne.descriptionMateriel}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{ligne.departementNom}</p>
                          <p className="text-[11px] text-blue-600 mt-0.5 font-semibold truncate max-w-[200px]">{ligne.descriptionMateriel}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-gray-100 text-gray-800 font-bold text-xs">
                        {ligne.quantite}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Dell Optiplex..."
                        value={formData[ligne.id]?.marque || ""}
                        onChange={e => handleLigneChange(ligne.id, "marque", e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <input 
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        placeholder="0.00"
                        value={formData[ligne.id]?.prixUnitaire || ""}
                        onChange={e => handleLigneChange(ligne.id, "prixUnitaire", e.target.value)}
                        className="w-32 px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
                      />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <input 
                        type="number"
                        min="0"
                        required
                        placeholder="Ex: 24"
                        value={formData[ligne.id]?.dureeGarantieMois || ""}
                        onChange={e => handleLigneChange(ligne.id, "dureeGarantieMois", e.target.value)}
                        className="w-32 px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
                      />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <input 
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={formData[ligne.id]?.dateLivraisonPrevue || ""}
                        onChange={e => handleLigneChange(ligne.id, "dateLivraisonPrevue", e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 italic text-sm">Le détail technique n'est pas encore disponible.</p>
          </div>
        )}
      </div>

      {errorMsg && <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
      {successMsg && <div className="mx-6 mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">{successMsg}</div>}

      <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button 
          onClick={handleSubmit}
          disabled={!isFormValid() || loading}
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Envoi en cours..." : "Soumettre mon offre formelle"}
        </button>
      </div>
    </div>
  );
}
