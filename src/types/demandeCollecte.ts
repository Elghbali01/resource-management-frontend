export interface DemandeCollecte {
  id: number;
  titre: string;
  description: string;
  dateCreation: string;
  dateLimite: string;
  statut: "OUVERTE" | "FERMEE" | "BROUILLON";
  departementId?: number;
  departementNom?: string;
  creeParNom?: string;
  creeParPrenom?: string;
}

export interface CreateDemandeCollecteRequest {
  titre: string;
  description: string;
  dateLimite: string;
}
