import api from "../../../services/api";
import type { AffectationPrevueResponse } from "../../../types/affectation";
import type { AppelOffreResponse, CreateAppelOffreRequest } from "../../../types/appelOffre";
import type { DemandeCollecte } from "../../../types/demandeCollecte";

const BASE = "/responsable/demandes-transmises";

export const responsableService = {
  getDemandesTransmises: (): Promise<DemandeCollecte[]> =>
    api.get(BASE).then((r) => r.data),

  getAffectationsPrevues: (demandeId: number): Promise<AffectationPrevueResponse[]> =>
    api.get(`/responsable/demandes-transmises/${demandeId}/affectations-prevues`).then((r) => r.data),

  createAppelOffre: (data: CreateAppelOffreRequest): Promise<AppelOffreResponse> =>
    api.post("/responsable/appels-offre", data).then((r) => r.data),

  getAppelsOffre: (): Promise<AppelOffreResponse[]> =>
    api.get("/responsable/appels-offre").then((r) => r.data),

  getAppelOffreById: (id: number): Promise<AppelOffreResponse> =>
    api.get(`/responsable/appels-offre/${id}`).then((r) => r.data),
};
