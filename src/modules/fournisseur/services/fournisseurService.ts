import api from "../../../services/api";
import type { AppelOffreResponse } from "../../../types/appelOffre";
import type { CreateOffreFournisseurRequest, OffreFournisseurResponse } from "../../../types/offreFournisseur";

export const fournisseurService = {
  getAppelsOffre: (): Promise<AppelOffreResponse[]> =>
    api.get("/fournisseurs/appels-offre").then((r) => r.data),

  getAppelOffreById: (id: number): Promise<AppelOffreResponse> =>
    api.get(`/fournisseurs/appels-offre/${id}`).then((r) => r.data),

  soumettreOffre: (data: CreateOffreFournisseurRequest): Promise<OffreFournisseurResponse> =>
    api.post("/fournisseurs/offres", data).then((r) => r.data),

  getMesOffres: (): Promise<OffreFournisseurResponse[]> =>
    api.get("/fournisseurs/offres/mes-offres").then((r) => r.data),
};
