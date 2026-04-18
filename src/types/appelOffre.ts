export type TypeAffectationPrevue = "ENSEIGNANT" | "DEPARTEMENT";
export type StatutAppelOffre = "OUVERT" | "FERME";

export interface AppelOffreLigneResponse {
  id: number;
  demandeId: number;
  typeAffectation: TypeAffectationPrevue;
  quantite: number;
  descriptionMateriel: string;
  departementNom: string;
  enseignantNom?: string | null;
  enseignantPrenom?: string | null;
}

export interface AppelOffreResponse {
  id: number;
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  statut: StatutAppelOffre;
  dateCreation: string;
  creeParNom: string;
  creeParPrenom: string;
  nombreLignes: number;
  nombreDemandes: number;
  lignes: AppelOffreLigneResponse[];
}

export interface CreateAppelOffreRequest {
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  demandeIds: number[];
}
