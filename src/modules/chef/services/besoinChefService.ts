import api from "../../../services/api";
import type { Besoin } from "../../../types/besoin";

export const besoinChefService = {
  getBesoinsByDemande: (demandeId: number): Promise<Besoin[]> =>
    api.get(`/chef/demandes/${demandeId}/besoins`).then((r) => r.data),
};
