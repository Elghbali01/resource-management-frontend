import type { DemandeCollecte } from "../../../types/demandeCollecte";

interface Props {
  demandes: DemandeCollecte[];
  selectedDemandeId?: number | null;
}

export default function OpenDemandesList({ demandes, selectedDemandeId }: Props) {
  return (
    <div className="enseignant-card">
      <div className="enseignant-card-header">
        <h2>Demandes ouvertes</h2>
        <p>Demandes actuellement ouvertes dans votre département.</p>
      </div>

      <div className="demande-list">
        {demandes.length === 0 ? (
          <div className="empty-state">Aucune demande ouverte pour le moment.</div>
        ) : (
          demandes.map((demande) => (
            <div
              key={demande.id}
              id={`demande-${demande.id}`}
              className={`demande-item ${selectedDemandeId === demande.id ? "demande-item-highlight" : ""}`}
            >
              <div className="demande-item-top">
                <h3>{demande.titre}</h3>
                <span className="demande-badge demande-badge-ouverte">{demande.statut}</span>
              </div>

              <p>{demande.description}</p>

              <div className="demande-meta">
                <span>Département : {demande.departementNom ?? "-"}</span>
                <span>Date limite : {new Date(demande.dateLimite).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
