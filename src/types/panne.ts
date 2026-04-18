export type StatutPanne =
  | "SIGNALEE"
  | "EN_COURS"
  | "CONSTAT_ENVOYE"
  | "DECISION_REPARATION"
  | "DECISION_REMPLACEMENT";

export type FrequencePanne = "RARE" | "FREQUENTE" | "PERMANENTE";
export type OrdrePanne = "LOGICIEL" | "MATERIEL";
export type DecisionMaintenance = "REPARATION_FOURNISSEUR" | "REMPLACEMENT_FOURNISSEUR";

export interface PanneResponse {
  id: number;
  ressourceId: number;
  numeroInventaire: string;
  codeBarres: string;
  typeMateriel: string;
  marque: string;
  descriptionSignalement: string;
  enseignantNom: string;
  enseignantPrenom: string;
  departementNom?: string;
  statut: StatutPanne;
  dateSignalement: string;
  dateDebutIntervention?: string;
  commentaireIntervention?: string;
  severe?: boolean;
  explicationPanne?: string;
  dateApparition?: string;
  frequence?: FrequencePanne;
  ordrePanne?: OrdrePanne;
  dateConstat?: string;
  technicienNom?: string;
  technicienPrenom?: string;
  decisionResponsable?: DecisionMaintenance;
  motifDecisionResponsable?: string;
  dateDecisionResponsable?: string;
  garantieValide?: boolean;
}
