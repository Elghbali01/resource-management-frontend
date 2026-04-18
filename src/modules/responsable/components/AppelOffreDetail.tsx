import type { AppelOffreResponse } from "../../../types/appelOffre";

interface Props {
  appelOffre: AppelOffreResponse;
}

export default function AppelOffreDetail({ appelOffre }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{appelOffre.titre}</h2>
          <p className="text-sm text-gray-500">ID: #{appelOffre.id} • Créé par {appelOffre.creeParNom} {appelOffre.creeParPrenom} le {new Date(appelOffre.dateCreation).toLocaleDateString("fr-FR")}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-bold rounded-lg ${appelOffre.statut === 'OUVERT' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
          {appelOffre.statut}
        </span>
      </div>

      <div className="p-6 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Date de début</p>
            <p className="font-semibold text-gray-800">{new Date(appelOffre.dateDebut).toLocaleDateString("fr-FR")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de fin</p>
            <p className="font-semibold text-gray-800">{new Date(appelOffre.dateFin).toLocaleDateString("fr-FR")}</p>
          </div>
        </div>
        {appelOffre.description && (
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-sm text-gray-700 mt-1">{appelOffre.description}</p>
          </div>
        )}
      </div>

      <div className="p-0">
        <div className="p-4 bg-blue-50/50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Lignes de l'Appel d'Offre</h3>
          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-lg">
            {appelOffre.nombreLignes} ligne(s)
          </span>
        </div>
        
        {appelOffre.lignes && appelOffre.lignes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 font-semibold">Bénéficiaire & Dépt</th>
                  <th className="px-4 py-3 font-semibold text-center">Type</th>
                  <th className="px-4 py-3 font-semibold">Matériel</th>
                  <th className="px-4 py-3 font-semibold text-center">Quantité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appelOffre.lignes.map(ligne => (
                  <tr key={ligne.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      {ligne.typeAffectation === "ENSEIGNANT" ? (
                        <div>
                          <p className="font-semibold text-gray-900">{ligne.enseignantNom} {ligne.enseignantPrenom}</p>
                          <p className="text-xs text-gray-500">{ligne.departementNom}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-gray-900">{ligne.departementNom}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Département (Collectif)
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${
                        ligne.typeAffectation === "ENSEIGNANT" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {ligne.typeAffectation}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">
                      {ligne.descriptionMateriel}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-gray-900">
                      {ligne.quantite}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 italic text-sm">
            Aucune ligne d'affectation rattachée à cet appel d'offre.
          </div>
        )}
      </div>
    </div>
  );
}
