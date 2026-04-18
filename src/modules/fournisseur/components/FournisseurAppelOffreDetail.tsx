import type { AppelOffreResponse } from "../../../types/appelOffre";

interface Props {
  appelOffre: AppelOffreResponse;
}

export default function FournisseurAppelOffreDetail({ appelOffre }: Props) {
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
              <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Service Demandeur</th>
                  <th className="px-6 py-3 font-semibold">Descriptif du Matériel</th>
                  <th className="px-6 py-3 font-semibold text-center">Quantité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appelOffre.lignes.map(ligne => (
                  <tr key={ligne.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {ligne.typeAffectation === "ENSEIGNANT" ? (
                        <div>
                          <p className="font-medium text-gray-800">{ligne.departementNom}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Poste individuel ({ligne.enseignantNom} {ligne.enseignantPrenom})</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-gray-800">{ligne.departementNom}</p>
                          <p className="text-xs text-blue-600 mt-0.5 flex items-center gap-1 font-semibold">
                            Requis global (Département)
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {ligne.descriptionMateriel}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-bold text-sm">
                        {ligne.quantite}
                      </span>
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

      <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button className="px-6 py-2.5 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed">
          Proposer une Offre (Bientôt disponible)
        </button>
      </div>
    </div>
  );
}
