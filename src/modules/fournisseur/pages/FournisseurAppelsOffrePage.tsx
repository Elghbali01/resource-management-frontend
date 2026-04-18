import { useEffect, useState } from "react";
import type { AppelOffreResponse } from "../../../types/appelOffre";
import { fournisseurService } from "../services/fournisseurService";
import FournisseurAppelOffreDetail from "../components/FournisseurAppelOffreDetail";

export default function FournisseurAppelsOffrePage() {
  const [appelsOffre, setAppelsOffre] = useState<AppelOffreResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppel, setSelectedAppel] = useState<AppelOffreResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const aos = await fournisseurService.getAppelsOffre();
      setAppelsOffre(aos);
    } catch (error: any) {
      console.error("Erreur de chargement fournisseur", error);
      const apiMessage = error?.response?.data?.erreur || error?.response?.data?.message || "Impossible de récupérer les appels d'offres en cours.";
      setErrorMsg(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectAppel = async (id: number) => {
    try {
      setLoading(true);
      const data = await fournisseurService.getAppelOffreById(id);
      setSelectedAppel(data);
    } catch (error: any) {
      const apiMessage = error?.response?.data?.erreur || error?.response?.data?.message || "Impossible de charger le détail de l'appel d'offre.";
      setErrorMsg(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Marchés & Appels d'Offres</h1>
        <p className="text-sm text-gray-500 mt-1">Consultez les demandes de matériel en cours et préparez vos propositions commerciales.</p>
      </div>

      {errorMsg && <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">{errorMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center justify-between">
              <span>Avis Publics</span>
              <span className="bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded-full">{appelsOffre.length}</span>
            </h2>
            
            {loading && appelsOffre.length === 0 ? (
              <p className="text-sm text-gray-500">Recherche d'opportunités...</p>
            ) : appelsOffre.length === 0 ? (
              <div className="text-center py-6">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-sm text-gray-500 italic">Aucun marché public ouvert actuellement.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appelsOffre.map(ao => (
                  <div 
                    key={ao.id} 
                    onClick={() => handleSelectAppel(ao.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedAppel?.id === ao.id ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-gray-200 hover:border-blue-300 hover:shadow-sm"}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">{ao.titre}</h3>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Clôture
                        </span>
                        <span className="font-semibold text-gray-800">{new Date(ao.dateFin).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Volume</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">{ao.nombreLignes} références</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedAppel ? (
            <FournisseurAppelOffreDetail appelOffre={selectedAppel} />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-5">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Détails de l'Appel d'Offre</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Veuillez sélectionner un marché dans la liste pour consulter le cahier des charges et le détail des besoins matériels.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
