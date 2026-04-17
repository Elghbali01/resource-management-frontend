import api from "../../../services/api";
import type { AffectationPrevueResponse } from "../../../types/affectation";
import type { DemandeCollecte } from "../../../types/demandeCollecte";

const BASE = "/responsable/demandes-transmises";

export const responsableService = {
  getDemandesTransmises: (): Promise<DemandeCollecte[]> =>
    api.get(BASE).then((r) => r.data),

  getAffectationsPrevues: (demandeId: number): Promise<AffectationPrevueResponse[]> =>
    api.get(`${BASE}/${demandeId}/affectations-prevues`).then((r) => r.data),
};
