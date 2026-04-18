import api from "../../../services/api";
import type { PanneResponse } from "../../../types/panne";

const BASE = "/technicien/pannes";

export const technicienService = {
  getPannes: (): Promise<PanneResponse[]> =>
    api.get(BASE).then((r) => r.data),

  commencerIntervention: (panneId: number, commentaireIntervention: string): Promise<PanneResponse> =>
    api.patch(`${BASE}/${panneId}/intervention`, { commentaireIntervention }).then((r) => r.data),

  redigerConstat: (panneId: number, constatData: any): Promise<PanneResponse> =>
    api.post(`${BASE}/${panneId}/constat`, constatData).then((r) => r.data),
};
