import type { DemandeCollecte } from "../../../types/demandeCollecte";

interface Props {
  demandes: DemandeCollecte[];
}

export default function DemandeCollecteList({ demandes }: Props) {
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
