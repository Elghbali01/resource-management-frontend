import api from "../../../services/api";
import type { DemandeCollecte } from "../../../types/demandeCollecte";

const BASE = "/enseignant/demandes-ouvertes";

export const enseignantDemandeService = {
  getOpenDemandes: (): Promise<DemandeCollecte[]> =>
    api.get(BASE).then((r) => r.data),
};
