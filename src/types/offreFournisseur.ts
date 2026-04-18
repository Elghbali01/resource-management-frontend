export interface CreateOffreLigneRequest {
  appelOffreLigneId: number;
  marque: string;
  prixUnitaire: number;
  dureeGarantieMois: number;
  dateLivraisonPrevue: string;
}

export interface CreateOffreFournisseurRequest {
  appelOffreId: number;
  lignes: CreateOffreLigneRequest[];
}

export interface OffreFournisseurLigneResponse {
  id: number;
  appelOffreLigneId: number;
  descriptionMateriel: string;
  quantite: number;
  departementNom: string;
  enseignantNom?: string | null;
  enseignantPrenom?: string | null;
  marque: string;
  prixUnitaire: number;
  prixTotalLigne: number;
  dureeGarantieMois: number;
  dateLivraisonPrevue: string;
}

export type StatutOffreFournisseur = "SOUMISE" | "ELIMINEE" | "REJETEE" | "ACCEPTEE";

export interface OffreFournisseurResponse {
  id: number;
  appelOffreId: number;
  appelOffreTitre: string;
  fournisseurId: number;
  nomSociete: string;
  email: string;
  statut: StatutOffreFournisseur;
  montantTotal: number;
  dateSoumission: string;
  motifDecision?: string | null;
  lignes: OffreFournisseurLigneResponse[];
}
