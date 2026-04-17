import { useEffect, useState } from "react";
import type { DemandeCollecte } from "../../../types/demandeCollecte";
import { responsableService } from "../services/responsableService";
import AffectationsPrevuesList from "../components/AffectationsPrevuesList";

export default function DemandesTransmisesPage() {
  const [demandes, setDemandes] = useState<DemandeCollecte[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState<DemandeCollecte | null>(null);

  useEffect(() => {
    loadDemandes();
  }, []);

  const loadDemandes = async () => {
    try {
      setLoading(true);
      const data = await responsableService.getDemandesTransmises();
      setDemandes(data);
    } catch (error: any) {
      console.error("Erreur de chargement", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="collecte-page p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="collecte-page-header mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Demandes Transmises</h1>
        <p className="text-sm text-gray-500 mt-1">Consultez les demandes clôturées et validées par les départements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Dossiers Reçus</h2>
            {loading ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : demandes.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucune demande transmise pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {demandes.map(d => (
                  <div 
                    key={d.id} 
                    onClick={() => setSelectedDemande(d)}
                    className={`p-4 border rounded-xl cursor-pointer transition-colors ${selectedDemande?.id === d.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-800 text-sm">{d.titre}</h3>
                      <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">{d.statut}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{d.departementNom}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Affectations: <strong className="text-blue-700">{d.nombreAffectationsPrevues}</strong></span>
                      <span className="text-gray-400">{d.dateTransmissionResponsable ? new Date(d.dateTransmissionResponsable).toLocaleDateString("fr-FR") : "-"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2">
          {selectedDemande ? (
            <AffectationsPrevuesList demandeId={selectedDemande.id} demandeTitre={selectedDemande.titre} departementNom={selectedDemande.departementNom} />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Sélectionnez un dossier</h3>
              <p className="text-sm text-gray-500">Cliquez sur une demande à gauche pour voir les détails des affectations prévues.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
