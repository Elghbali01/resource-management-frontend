import api from "../../../services/api";

export interface DepartementResponse {
  id: number;
  nom: string;
  chefNom: string | null;
  chefPrenom: string | null;
  chefEmail: string | null;
  nombreEnseignants: number;
}

export interface DepartementRequest {
  nom: string;
}

const BASE = "/admin/departements";

export const departementService = {
  getAll: (): Promise<DepartementResponse[]> => 
    api.get(BASE).then((r) => r.data),

  getById: (id: number): Promise<DepartementResponse> => 
    api.get(`${BASE}/${id}`).then((r) => r.data),

  create: (data: DepartementRequest): Promise<DepartementResponse> =>
    api.post(BASE, data).then((r) => r.data),

  update: (id: number, data: DepartementRequest): Promise<DepartementResponse> =>
    api.put(`${BASE}/${id}`, data).then((r) => r.data),

  delete: (id: number): Promise<{ message: string }> =>
    api.delete(`${BASE}/${id}`).then((r) => r.data),
};
