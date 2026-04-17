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
}

export interface BesoinRequest {
  demandeId: number;
  typeMateriel: "ORDINATEUR" | "IMPRIMANTE";
  quantite: number;
  marqueSouhaitee?: string;
  caracteristiques?: string;
  justification?: string;
}
