import api from "../../../services/api";

export interface EnseignantResponse {
  id: number;
  userId: number;
  nom: string;
  prenom: string;
  email: string;
  status: string;
  departementNom: string;
}

export interface DepartementResponse {
  id: number;
  nom: string;
  budget?: number;
  chefNom?: string;
  chefPrenom?: string;
  chefEmail?: string;
  nombreEnseignants?: number;
}

const BASE = "/chef";

export const chefService = {
  // Liste les enseignants du département du chef (excluant le chef)
  getEnseignants: (): Promise<EnseignantResponse[]> =>
    api.get(`${BASE}/enseignants`).then((r) => r.data),

  // Récupérer le budget du département (endpoint hypothétique pour le chef, ou peut-être existe-t-il)
  getMonDepartement: (): Promise<DepartementResponse> =>
    api.get(`${BASE}/departement`).then((r) => r.data),
};
