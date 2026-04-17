export interface TransmissionDemandeResponse {
  demandeId: number;
  statut: "TRANSMISE";
  dateTransmission: string;
  nombreAffectationsPrevues: number;
  message: string;
}

export type TypeAffectation = "ENSEIGNANT" | "DEPARTEMENT";

export interface AffectationPrevueResponse {
  id: number;
  demandeId: number;
  typeAffectation: TypeAffectation;
  quantite: number;
  descriptionMateriel: string;
  departementNom: string;
  enseignantId?: number | null;
  enseignantNom?: string | null;
  enseignantPrenom?: string | null;
  dateCreation: string;
}
