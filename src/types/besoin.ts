export type TypeMateriel = "ORDINATEUR" | "IMPRIMANTE";
export type NatureBesoin = "INDIVIDUEL" | "COLLECTIF";

export interface Besoin {
  id: number;
  demandeId: number;
  demandeTitre: string;
  demandeDateLimite: string;
  typeMateriel: TypeMateriel;
  natureBesoin: NatureBesoin;
  quantite: number;
  marqueSouhaitee?: string;
  caracteristiques?: string;
  justification?: string;
  dateSoumission: string;
  derniereModification: string;
  enseignantId?: number;
  enseignantUserId?: number;
  enseignantNom?: string;
  enseignantPrenom?: string;
  departementNom?: string;

  cpu?: string;
  ram?: string;
  disqueDur?: string;
  ecran?: string;
  vitesseImpression?: string;
  resolution?: string;
}

export interface BesoinRequest {
  demandeId: number;
  typeMateriel: TypeMateriel;
  quantite: number;
  marqueSouhaitee?: string;
  justification?: string;

  cpu?: string;
  ram?: string;
  disqueDur?: string;
  ecran?: string;
  
  vitesseImpression?: string;
  resolution?: string;
}
