import api from "../../../services/api";
import type { Besoin, BesoinRequest } from "../../../types/besoin";

export const besoinChefService = {
  getBesoinsByDemande: (demandeId: number): Promise<Besoin[]> =>
    api.get(`/chef/besoins/demande/${demandeId}`).then((r) => r.data),

  getCollectifsByDemande: (demandeId: number): Promise<Besoin[]> =>
    api.get(`/chef/besoins/demande/${demandeId}/collectifs`).then((r) => r.data),

  createCollectif: (data: BesoinRequest): Promise<Besoin> =>
    api.post("/chef/besoins/collectifs", data).then((r) => r.data),

  update: (id: number, data: BesoinRequest): Promise<Besoin> =>
    api.put(`/chef/besoins/${id}`, data).then((r) => r.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/chef/besoins/${id}`).then((r) => r.data),
};
