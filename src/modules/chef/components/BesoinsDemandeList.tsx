import type { Besoin } from "../../../types/besoin";

interface Props {
  besoins: Besoin[];
  demandeTitre: string;
}

export default function BesoinsDemandeList({ besoins, demandeTitre }: Props) {
  return (
    <div className="collecte-card mt-6">
      <div className="collecte-card-header">
        <h2>Besoins pour : {demandeTitre}</h2>
        <p>Consultation des demandes de matériel soumises par les enseignants.</p>
      </div>

      <div className="demande-list">
        {besoins.length === 0 ? (
          <div className="empty-state">Aucun besoin soumis pour cette demande.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 font-semibold text-gray-700">Enseignant</th>
                  <th className="p-3 font-semibold text-gray-700">Matériel</th>
                  <th className="p-3 font-semibold text-gray-700">Quantité</th>
                  <th className="p-3 font-semibold text-gray-700">Marque / Details</th>
                  <th className="p-3 font-semibold text-gray-700">Justification</th>
                  <th className="p-3 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {besoins.map((b) => (
                  <tr key={b.id} className="border-b hover:bg-gray-50/50">
                    <td className="p-3">
                      {b.enseignantNom} {b.enseignantPrenom}
                    </td>
                    <td className="p-3">
                      <span className="font-medium">{b.typeMateriel}</span>
                    </td>
                    <td className="p-3 font-bold">{b.quantite}</td>
                    <td className="p-3 text-sm text-gray-600">
                      <div><span className="font-semibold">Marque:</span> {b.marqueSouhaitee || "-"}</div>
                      {b.typeMateriel === "ORDINATEUR" && (
                        <>
                          {b.cpu && <div><span className="font-semibold">CPU:</span> {b.cpu}</div>}
                          {b.ram && <div><span className="font-semibold">RAM:</span> {b.ram}</div>}
                          {b.disqueDur && <div><span className="font-semibold">Stockage:</span> {b.disqueDur}</div>}
                          {b.ecran && <div><span className="font-semibold">Écran:</span> {b.ecran}</div>}
                        </>
                      )}
                      {b.typeMateriel === "IMPRIMANTE" && (
                        <>
                          {b.vitesseImpression && <div><span className="font-semibold">Vitesse:</span> {b.vitesseImpression}</div>}
                          {b.resolution && <div><span className="font-semibold">Résolution:</span> {b.resolution}</div>}
                        </>
                      )}
                    </td>
                    <td className="p-3 text-sm italic text-gray-600">
                      {b.justification || "-"}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(b.dateSoumission).toLocaleDateString("fr-FR")}
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
