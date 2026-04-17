export interface DemandeCollecte {
  id: number;
  titre: string;
  description: string;
  dateCreation: string;
  dateLimite: string;
  statut: "BROUILLON" | "OUVERTE" | "CONCERTATION" | "VALIDEE" | "TRANSMISE";
  departementId: number;
  departementNom: string;
  creeParNom: string;
  creeParPrenom: string;

  dateDebutConcertation?: string;
  dateFinConcertation?: string;
  compteRenduConcertation?: string;
  dateValidationChef?: string;
  dateTransmissionResponsable?: string;
  nombreAffectationsPrevues?: number;
}

export interface CreateDemandeCollecteRequest {
  titre: string;
  description: string;
  dateLimite: string;
}
