import api from "../../../services/api";
import type { Besoin, BesoinRequest } from "../../../types/besoin";

const BASE = "/enseignant/besoins";

export const besoinService = {
  create: (data: BesoinRequest): Promise<Besoin> =>
    api.post(BASE, data).then((r) => r.data),

  update: (id: number, data: BesoinRequest): Promise<Besoin> =>
    api.put(`${BASE}/${id}`, data).then((r) => r.data),

  delete: (id: number): Promise<void> =>
    api.delete(`${BASE}/${id}`).then((r) => r.data),

  getByDemande: (demandeId: number): Promise<Besoin[]> =>
    api.get(`${BASE}/demande/${demandeId}`).then((r) => r.data),
};
