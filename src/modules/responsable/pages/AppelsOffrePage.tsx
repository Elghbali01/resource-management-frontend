import { useEffect, useState } from "react";
import type { AppelOffreResponse, CreateAppelOffreRequest } from "../../../types/appelOffre";
import type { DemandeCollecte } from "../../../types/demandeCollecte";
import { responsableService } from "../services/responsableService";
import AppelOffreDetail from "../components/AppelOffreDetail";
import CreateAppelOffrePanel from "../components/CreateAppelOffrePanel";

export default function AppelsOffrePage() {
  const [appelsOffre, setAppelsOffre] = useState<AppelOffreResponse[]>([]);
  const [demandesTransmises, setDemandesTransmises] = useState<DemandeCollecte[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedAppel, setSelectedAppel] = useState<AppelOffreResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [aos, demandes] = await Promise.all([
        responsableService.getAppelsOffre(),
        responsableService.getDemandesTransmises(),
      ]);
      setAppelsOffre(aos);
      // We only care about validated/transmitted demands that might not be in an AO yet
      // The backend logic handles it, we just display the available ones.
      setDemandesTransmises(demandes);
    } catch (error: any) {
      console.error("Erreur de chargement", error);
      setErrorMsg("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreated = async (created: AppelOffreResponse) => {
    setIsCreating(false);
    setSuccessMsg(`Appel d'offre "${created.titre}" créé avec succès !`);
    setTimeout(() => setSuccessMsg(""), 5000);
    loadData();
    setSelectedAppel(created);
  };

  const handleSelectAppel = async (id: number) => {
    setIsCreating(false);
    try {
      setLoading(true);
      const data = await responsableService.getAppelOffreById(id);
      setSelectedAppel(data);
    } catch (error: any) {
      setErrorMsg("Impossible de charger le détail de l'appel d'offre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="collecte-page p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="collecte-page-header mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appels d'Offres</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les appels d'offres créés à partir des demandes des départements.</p>
        </div>
        <button 
          onClick={() => { setIsCreating(true); setSelectedAppel(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition font-medium"
        >
          + Créer un Appel d'Offre
        </button>
      </div>

      {errorMsg && <div className="collecte-alert collecte-alert-error mb-4">{errorMsg}</div>}
      {successMsg && <div className="collecte-alert collecte-alert-success mb-4">{successMsg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Historique des AOs</h2>
            {loading && appelsOffre.length === 0 ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : appelsOffre.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucun appel d'offre n'a été créé.</p>
            ) : (
              <div className="space-y-3">
                {appelsOffre.map(ao => (
                  <div 
                    key={ao.id} 
                    onClick={() => handleSelectAppel(ao.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-colors ${selectedAppel?.id === ao.id && (!isCreating) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{ao.titre}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ao.statut === 'OUVERT' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {ao.statut}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-3">
                      <span className="text-gray-600">Demandes: <strong className="text-blue-700">{ao.nombreDemandes}</strong></span>
                      <span className="text-gray-400">{new Date(ao.dateDebut).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2">
          {isCreating ? (
            <CreateAppelOffrePanel 
              demandes={demandesTransmises} 
              onCreated={handleCreated} 
              onCancel={() => setIsCreating(false)} 
            />
          ) : selectedAppel ? (
            <AppelOffreDetail appelOffre={selectedAppel} />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Sélectionnez un appel d'offre</h3>
              <p className="text-sm text-gray-500">Cliquez sur un AO à gauche pour voir les détails ou créez-en un nouveau.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
