import api from "../../../services/api";
import type { PanneResponse } from "../../../types/panne";

export const panneService = {
  getMesPannes: (): Promise<PanneResponse[]> =>
    api.get("/enseignant/pannes").then((r) => r.data),

  signalerPanne: (data: { ressourceId: number; descriptionSignalement: string }): Promise<PanneResponse> =>
    api.post("/enseignant/pannes", data).then((r) => r.data),

  getMesRessources: (): Promise<any[]> =>
    api.get("/enseignant/pannes/ressources").then((r) => r.data),
};
