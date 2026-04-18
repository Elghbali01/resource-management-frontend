import { useEffect, useState } from "react";
import type { OffreFournisseurResponse } from "../../../types/offreFournisseur";
import { fournisseurService } from "../services/fournisseurService";

export default function MesOffresPage() {
  const [offres, setOffres] = useState<OffreFournisseurResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fournisseurService.getMesOffres();
      setOffres(data);
    } catch (error: any) {
      console.error("Erreur de chargement de mes offres", error);
      setErrorMsg("Impossible de récupérer l'historique de vos offres.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "SOUMISE": return <span className="bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full text-xs">SOUMISE (En attente)</span>;
      case "ACCEPTEE": return <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full text-xs">ACCEPTEE</span>;
      case "REJETEE": return <span className="bg-gray-100 text-gray-700 font-bold px-2 py-1 rounded-full text-xs">REJETEE</span>;
      case "ELIMINEE": return <span className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded-full text-xs">ÉLIMINÉE</span>;
      default: return <span className="bg-gray-100 text-gray-700 font-bold px-2 py-1 rounded-full text-xs">{statut}</span>;
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mes Offres Commerciales</h1>
        <p className="text-sm text-gray-500 mt-1">Consultez l'historique et le statut de vos propositions tarifaires soumises.</p>
      </div>

      {errorMsg && <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">{errorMsg}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-blue-50/50 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Historique des Soumissions</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement de votre historique...</div>
        ) : offres.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 italic">Vous n'avez pas encore soumis de proposition commerciale à ce jour.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {offres.map(offre => (
              <div key={offre.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Appel d'offre : {offre.appelOffreTitre}</h3>
                    <p className="text-sm text-gray-500">Soumis le {new Date(offre.dateSoumission).toLocaleDateString("fr-FR")} à {new Date(offre.dateSoumission).toLocaleTimeString("fr-FR", {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatutBadge(offre.statut)}
                    <span className="font-extrabold text-blue-900 text-lg">{offre.montantTotal.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</span>
                  </div>
                </div>

                {offre.motifDecision && (
                  <div className={`p-3 rounded-lg text-sm mb-4 border ${offre.statut === 'ACCEPTEE' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <strong className="block mb-1">Motif de la décision :</strong>
                    {offre.motifDecision}
                  </div>
                )}

                <div className="mt-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Détail des {offre.lignes?.length || 0} équipements proposés</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {offre.lignes?.map(l => (
                      <div key={l.id} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm text-sm">
                        <div className="font-bold text-gray-800 mb-1 line-clamp-1" title={l.descriptionMateriel}>{l.descriptionMateriel}</div>
                        <div className="text-xs text-gray-500 mb-2">{l.departementNom} {l.enseignantNom ? `(${l.enseignantNom})` : "(Collectif)"}</div>
                        <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                          <span>Marque proposée:</span>
                          <span className="font-medium text-gray-900">{l.marque}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                          <span>P.U:</span>
                          <span className="font-medium text-gray-900">{l.prixUnitaire} €</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                          <span>Garantie:</span>
                          <span className="font-medium text-gray-900">{l.dureeGarantieMois} mois</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-600 font-bold border-t border-gray-50 pt-1 mt-1">
                          <span>TOTAL LIGNE:</span>
                          <span className="text-blue-700">{l.prixTotalLigne} €</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
