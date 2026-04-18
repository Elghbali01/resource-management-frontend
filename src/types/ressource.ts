export type TypeMateriel = "ORDINATEUR" | "IMPRIMANTE";
export type StatutRessource = "DISPONIBLE" | "AFFECTEE";

export interface RessourceResponse {
  id: number;
  numeroInventaire: string;
  codeBarres: string;
  typeMateriel: TypeMateriel;
  marque: string;
  caracteristiques?: string;
  dateLivraison: string;
  statut: StatutRessource;
  fournisseurId: number;
  nomSociete: string;
  offreId: number;
  dateCreation: string;
}

export type TypeBeneficiaireAffectation = "ENSEIGNANT" | "DEPARTEMENT";

export interface AffectationRessourceResponse {
  id: number;
  ressourceId: number;
  numeroInventaire: string;
  codeBarres: string;
  departementNom: string;
  enseignantId?: number | null;
  enseignantNom?: string | null;
  enseignantPrenom?: string | null;
  typeBeneficiaire: TypeBeneficiaireAffectation;
  dateAffectation: string;
}

export interface UpdateRessourceRequest {
  typeMateriel: TypeMateriel | string;
  marque: string;
  caracteristiques?: string;
}

export interface CreateAffectationRequest {
  ressourceId: number;
  departementId: number;
  enseignantId?: number | null;
}
