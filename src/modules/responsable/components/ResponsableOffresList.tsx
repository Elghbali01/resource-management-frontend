import { useEffect, useState } from "react";
import type { OffreFournisseurResponse } from "../../../types/offreFournisseur";
import { responsableService } from "../services/responsableService";

interface Props {
  appelOffreId: number;
}

export default function ResponsableOffresList({ appelOffreId }: Props) {
  const [offres, setOffres] = useState<OffreFournisseurResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  
  const [motif, setMotif] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadOffres = async () => {
    try {
      setLoading(true);
      const data = await responsableService.getOffresByAppelOffre(appelOffreId);
      setOffres(data);
    } catch (error) {
      console.error("Erreur chargement offres reçues", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffres();
  }, [appelOffreId]);

  const handleAction = async (offreId: number, type: 'ACCEPTER' | 'ELIMINER') => {
    if (!motif) {
      setActionError("Un motif est obligatoire pour accepter ou éliminer une offre.");
      return;
    }

    try {
      setProcessingId(offreId);
      setActionError("");
      setActionSuccess("");

      if (type === 'ACCEPTER') {
        await responsableService.accepterOffre(offreId, motif);
        setActionSuccess("L'offre a été acceptée avec succès.");
      } else {
        await responsableService.eliminerOffre(offreId, motif);
        setActionSuccess("Le fournisseur a été éliminé avec succès.");
      }
      
      setMotif("");
      loadOffres(); // Reload after action to update statuts
    } catch (err: any) {
      // THE CRUCIAL BUDGET/BUSINESS RULES ERROR EXTRACTION
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || `Erreur lors du traitement de l'offre.`;
      setActionError(apiMessage);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && offres.length === 0) {
    return <div className="p-4 text-sm text-gray-500">Chargement des offres fournisseurs reçues...</div>;
  }

  if (offres.length === 0) {
    return (
      <div className="p-8 text-center bg-white border-t border-gray-100 rounded-b-2xl">
        <p className="text-gray-500 italic">Aucune proposition n'a encore été soumise pour cet appel d'offre.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-gray-100 p-0 rounded-b-2xl">
      <div className="p-4 bg-purple-50 flex justify-between items-center border-b border-gray-100">
        <h3 className="font-bold text-gray-800">Propositions des Fournisseurs ({offres.length})</h3>
      </div>

      <div className="p-4">
        {actionError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex gap-3 items-start shadow-sm">
            <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-bold mb-1">Action impossible ou refusée</p>
              <p>{actionError}</p>
            </div>
          </div>
        )}

        {actionSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
            {actionSuccess}
          </div>
        )}

        <div className="space-y-4">
          {offres.map(offre => (
            <div key={offre.id} className={`border rounded-xl p-4 ${offre.statut === 'ACCEPTEE' ? 'border-green-300 bg-green-50/20' : offre.statut === 'ELIMINEE' || offre.statut === 'REJETEE' ? 'border-gray-200 bg-gray-50 opacity-80' : 'border-blue-200 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">{offre.nomSociete}</h4>
                  <p className="text-xs text-gray-500">{offre.email} • Soumis le {new Date(offre.dateSoumission).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 text-xs font-bold rounded-lg mb-1 ${
                    offre.statut === 'ACCEPTEE' ? 'bg-green-100 text-green-700' :
                    offre.statut === 'SOUMISE' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {offre.statut}
                  </span>
                  <div className="font-extrabold text-blue-900">{offre.montantTotal.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</div>
                </div>
              </div>

              {/* Action Panel for SOUMISE offers */}
              {offre.statut === 'SOUMISE' && (
                <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Prendre une décision :</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Saisissez un motif obligatoire (Ex: Moins disant, Hors budget...)"
                      onChange={(e) => {
                        if (processingId === offre.id) return; 
                        setMotif(e.target.value);
                      }}
                      disabled={processingId !== null && processingId !== offre.id}
                      className="flex-1 text-sm border-gray-300 rounded px-3 py-1.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <button 
                      onClick={() => handleAction(offre.id, 'ELIMINEE')}
                      disabled={processingId !== null}
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded transition"
                    >
                      {processingId === offre.id ? '...' : 'Éliminer'}
                    </button>
                    <button 
                      onClick={() => handleAction(offre.id, 'ACCEPTER')}
                      disabled={processingId !== null}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded transition shadow-sm"
                    >
                      {processingId === offre.id ? '...' : 'Accepter'}
                    </button>
                  </div>
                </div>
              )}

              {/* If there is a motif to show for finished ones */}
              {offre.motifDecision && (
                <div className={`mt-3 text-xs p-2 rounded-lg ${offre.statut === 'ACCEPTEE' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                  <strong>Motif :</strong> {offre.motifDecision}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
