import api from "../../../services/api";
import type { AppelOffreResponse } from "../../../types/appelOffre";

export const fournisseurService = {
  getAppelsOffre: (): Promise<AppelOffreResponse[]> =>
    api.get("/fournisseurs/appels-offre").then((r) => r.data),

  getAppelOffreById: (id: number): Promise<AppelOffreResponse> =>
    api.get(`/fournisseurs/appels-offre/${id}`).then((r) => r.data),
};
