import type { Besoin } from "../../../types/besoin";

interface Props {
  besoins: Besoin[];
  onEdit: (besoin: Besoin) => void;
  onDelete: (id: number) => void;
}

export default function BesoinList({ besoins, onEdit, onDelete }: Props) {
  if (besoins.length === 0) {
    return <div className="text-gray-500 text-sm italic mt-4">Vous n'avez pas encore soumis de besoin pour cette demande.</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Vos besoins soumis</h3>
      <div className="space-y-4">
        {besoins.map((b) => (
          <div key={b.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-800">{b.typeMateriel}</span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">Qté: {b.quantite}</span>
            </div>
            {b.marqueSouhaitee && <p className="text-sm text-gray-700"><span className="font-semibold">Marque:</span> {b.marqueSouhaitee}</p>}
            {b.typeMateriel === "ORDINATEUR" && (
              <div className="text-sm text-gray-700 mt-1">
                {b.cpu && <div><span className="font-semibold">CPU:</span> {b.cpu}</div>}
                {b.ram && <div><span className="font-semibold">RAM:</span> {b.ram}</div>}
                {b.disqueDur && <div><span className="font-semibold">Stockage:</span> {b.disqueDur}</div>}
                {b.ecran && <div><span className="font-semibold">Écran:</span> {b.ecran}</div>}
              </div>
            )}
            {b.typeMateriel === "IMPRIMANTE" && (
              <div className="text-sm text-gray-700 mt-1">
                {b.vitesseImpression && <div><span className="font-semibold">Vitesse:</span> {b.vitesseImpression}</div>}
                {b.resolution && <div><span className="font-semibold">Résolution:</span> {b.resolution}</div>}
              </div>
            )}
            {b.caracteristiques && <p className="text-sm text-gray-700"><span className="font-semibold">Détails:</span> {b.caracteristiques}</p>}
            {b.justification && <p className="text-sm text-gray-700 italic mt-1 bg-white p-2 border rounded"><span className="font-semibold">Justification:</span> {b.justification}</p>}
            
            <div className="flex border-t mt-3 pt-3 gap-3 justify-end">
               <button
                 onClick={() => onEdit(b)}
                 className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
               >
                 Modifier
               </button>
               <button
                 onClick={() => {
                   if (window.confirm("Êtes-vous sûr de vouloir supprimer ce besoin ?")) {
                     onDelete(b.id);
                   }
                 }}
                 className="text-sm font-medium text-red-600 hover:text-red-800 transition"
               >
                 Supprimer
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
