import { RessourceResponse } from "./ressource";

export interface ReceptionLivraisonResponse {
  offreId: number;
  nomSociete: string;
  dateLivraison: string;
  nombreRessourcesCreees: number;
  ressources: RessourceResponse[];
}

export interface CreateReceptionRequest {
  offreId: number;
  dateLivraison: string;
  lieu?: string;
  adresse?: string;
  siteInternet?: string;
  gerant?: string;
}
