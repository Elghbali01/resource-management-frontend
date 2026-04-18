import api from "../../../services/api";
import type { AffectationPrevueResponse } from "../../../types/affectation";
import type { AppelOffreResponse, CreateAppelOffreRequest } from "../../../types/appelOffre";
import type { OffreFournisseurResponse } from "../../../types/offreFournisseur";
import type { FournisseurAdminResponse } from "../../../types/fournisseur";
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

  getOffresByAppelOffre: (appelOffreId: number): Promise<OffreFournisseurResponse[]> =>
    api.get(`/responsable/offres/appel-offre/${appelOffreId}`).then((r) => r.data),

  eliminerOffre: (offreId: number, motif: string): Promise<void> =>
    api.patch(`/responsable/offres/${offreId}/eliminer`, { motif }),

  accepterOffre: (offreId: number, motif: string): Promise<void> =>
    api.patch(`/responsable/offres/${offreId}/accepter`, { motif }),

  getFournisseurs: (): Promise<FournisseurAdminResponse[]> =>
    api.get("/responsable/fournisseurs").then((r) => r.data),

  blacklistFournisseur: (fournisseurId: number, motif: string): Promise<void> =>
    api.patch(`/responsable/fournisseurs/${fournisseurId}/blacklist`, { motif }),

  retirerBlacklistFournisseur: (fournisseurId: number): Promise<void> =>
    api.patch(`/responsable/fournisseurs/${fournisseurId}/retirer-blacklist`),

  // Nouveaux endpoints pour Livraison et Inventaire
  receptionnerLivraison: (data: any): Promise<any> =>
    api.post("/responsable/ressources/reception", data).then((r) => r.data),

  getRessources: (): Promise<any[]> =>
    api.get("/responsable/ressources").then((r) => r.data),

  getRessourceById: (id: number): Promise<any> =>
    api.get(`/responsable/ressources/${id}`).then((r) => r.data),

  updateRessource: (id: number, data: any): Promise<any> =>
    api.put(`/responsable/ressources/${id}`, data).then((r) => r.data),

  deleteRessource: (id: number): Promise<void> =>
    api.delete(`/responsable/ressources/${id}`),

  getAffectations: (): Promise<any[]> =>
    api.get("/responsable/ressources/affectations").then((r) => r.data),

  createAffectation: (data: any): Promise<any> =>
    api.post("/responsable/ressources/affectations", data).then((r) => r.data),

  updateAffectation: (id: number, data: any): Promise<any> =>
    api.put(`/responsable/ressources/affectations/${id}`, data).then((r) => r.data),

  deleteAffectation: (id: number): Promise<void> =>
    api.delete(`/responsable/ressources/affectations/${id}`),
};
