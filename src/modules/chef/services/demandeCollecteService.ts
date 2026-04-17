import api from "../../../services/api";
import type {
  DemandeCollecte,
  CreateDemandeCollecteRequest,
} from "../../../types/demandeCollecte";

const BASE = "/chef/demandes";

export const demandeCollecteService = {
  create: (data: CreateDemandeCollecteRequest): Promise<DemandeCollecte> =>
    api.post(BASE, data).then((r) => r.data),

  getAll: (): Promise<DemandeCollecte[]> =>
    api.get(BASE).then((r) => r.data),

  open: (id: number): Promise<DemandeCollecte> =>
    api.patch(`${BASE}/${id}/ouvrir`).then((r) => r.data),

  close: (id: number): Promise<DemandeCollecte> =>
    api.patch(`${BASE}/${id}/fermer`).then((r) => r.data),
};
