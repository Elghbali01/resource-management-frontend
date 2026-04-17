import type { DemandeCollecte } from "../../../types/demandeCollecte";

interface Props {
  demandes: DemandeCollecte[];
  onOpen: (id: number) => void;
  onClose: (id: number) => void;
  onConsult: (id: number) => void;
}

export default function DemandeCollecteList({ demandes, onOpen, onClose, onConsult }: Props) {
  return (
    <div className="collecte-card">
      <div className="collecte-card-header">
        <h2>Demandes déjà créées</h2>
        <p>Historique des collectes du département.</p>
      </div>

      <div className="demande-list">
        {demandes.length === 0 ? (
          <div className="empty-state">Aucune demande créée pour le moment.</div>
        ) : (
          demandes.map((demande) => (
            <div key={demande.id} className="demande-item">
              <div className="demande-item-top">
                <h3>{demande.titre}</h3>
                <span className={`demande-badge demande-badge-${demande.statut.toLowerCase()}`}>
                  {demande.statut}
                </span>
              </div>
              <p>{demande.description}</p>
              <div className="demande-meta">
                <span>Date création : {new Date(demande.dateCreation).toLocaleString("fr-FR")}</span>
                <span>Date limite : {new Date(demande.dateLimite).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="demande-actions mt-4 flex gap-2">
                {demande.statut === "BROUILLON" && (
                  <button
                    onClick={() => onOpen(demande.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
                  >
                    Ouvrir
                  </button>
                )}
                {demande.statut === "OUVERTE" && (
                  <button
                    onClick={() => onClose(demande.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                  >
                    Fermer
                  </button>
                )}
                <button
                  onClick={() => onConsult(demande.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                >
                  Consulter les besoins
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
