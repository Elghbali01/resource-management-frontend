import { useEffect, useState } from "react";
import type { FournisseurAdminResponse } from "../../../types/fournisseur";
import { responsableService } from "../services/responsableService";

export default function FournisseursListPage() {
  const [fournisseurs, setFournisseurs] = useState<FournisseurAdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  
  const [blacklistModal, setBlacklistModal] = useState<{ isOpen: boolean; fournisseurId: number | null }>({ isOpen: false, fournisseurId: null });
  const [motif, setMotif] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadFournisseurs = async () => {
    try {
      setLoading(true);
      const data = await responsableService.getFournisseurs();
      setFournisseurs(data);
    } catch (error) {
      console.error("Erreur chargement fournisseurs", error);
      setActionError("Impossible de charger la liste des fournisseurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFournisseurs();
  }, []);

  const handleBlacklist = async () => {
    if (!motif.trim()) {
      setActionError("Le motif de mise en liste noire est obligatoire.");
      return;
    }
    
    if (!blacklistModal.fournisseurId) return;

    try {
      setProcessingId(blacklistModal.fournisseurId);
      setActionError("");
      setActionSuccess("");

      await responsableService.blacklistFournisseur(blacklistModal.fournisseurId, motif);
      setActionSuccess("Le fournisseur a été placé sur la liste noire avec succès.");
      setBlacklistModal({ isOpen: false, fournisseurId: null });
      setMotif("");
      loadFournisseurs();
    } catch (err: any) {
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors de la mise en liste noire.";
      setActionError(apiMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRetirerBlacklist = async (fournisseurId: number) => {
    try {
      setProcessingId(fournisseurId);
      setActionError("");
      setActionSuccess("");

      await responsableService.retirerBlacklistFournisseur(fournisseurId);
      setActionSuccess("Le fournisseur a été retiré de la liste noire avec succès.");
      loadFournisseurs();
    } catch (err: any) {
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors du retrait de la liste noire.";
      setActionError(apiMessage);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="collecte-page p-6 lg:p-8 bg-gray-50 min-h-screen relative">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Annuaires des Fournisseurs</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez la liste des entreprises partenaires et leur statut de confiance (Liste Noire).</p>
      </div>

      {actionError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm shadow-sm">
          {actionError}
        </div>
      )}

      {actionSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium shadow-sm">
          {actionSuccess}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-blue-50/50 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Partenaires Enregistrés</h2>
          <span className="text-sm font-medium text-gray-500">{fournisseurs.length} prestataires</span>
        </div>

        {loading && fournisseurs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chargement de l'annuaire...</div>
        ) : fournisseurs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 italic">Aucun fournisseur n'est encore enregistré dans le système.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {fournisseurs.map(f => (
              <div key={f.fournisseurId} className={`border rounded-xl p-5 relative overflow-hidden transition-all ${f.blacklisted ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'}`}>
                {f.blacklisted && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Blacklisté
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${f.blacklisted ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {f.nomSociete.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{f.nomSociete}</h3>
                    <p className="text-sm text-gray-500">{f.email || "Aucun email"}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-2 mb-5">
                  <p><strong className="text-gray-800">Gérant:</strong> {f.gerant || "Non spécifié"}</p>
                  <p className="truncate"><strong className="text-gray-800">Adresse:</strong> {f.adresse || "Non spécifiée"}</p>
                </div>

                {f.blacklisted && f.blacklistMotif && (
                  <div className="mb-4 text-xs bg-red-100/50 text-red-800 p-3 rounded-lg border border-red-100">
                    <strong className="block mb-1 text-red-900">Motif du bannissement:</strong>
                    {f.blacklistMotif}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                  {f.blacklisted ? (
                    <button 
                      onClick={() => handleRetirerBlacklist(f.fournisseurId)}
                      disabled={processingId === f.fournisseurId}
                      className="text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors w-full"
                    >
                      {processingId === f.fournisseurId ? "Traitement..." : "Retirer de la liste noire"}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setBlacklistModal({ isOpen: true, fournisseurId: f.fournisseurId })}
                      disabled={processingId === f.fournisseurId}
                      className="text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-lg transition-colors w-full"
                    >
                      Mettre en liste noire
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blacklist Modal overlay */}
      {blacklistModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Placer ce fournisseur en Liste Noire</h3>
            <p className="text-sm text-gray-500 mb-4">Ce fournisseur ne pourra plus soumettre d'offres commerciales tant qu'il ne sera pas retiré de cette liste.</p>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Motif de la décision (Obligatoire)</label>
              <textarea 
                rows={3}
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="Ex: Non-respect des engagements, matériel de retour défectueux, etc."
                className="w-full text-sm border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500 px-3 py-2 border"
              ></textarea>
            </div>

            <div className="flex gap-3 justify-end mt-6 border-t border-gray-100 pt-4">
              <button 
                onClick={() => { setBlacklistModal({ isOpen: false, fournisseurId: null }); setMotif(""); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
              >
                Annuler
              </button>
              <button 
                onClick={handleBlacklist}
                disabled={processingId !== null || !motif.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {processingId !== null ? "Traitement..." : "Confirmer la Liste Noire"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
