export interface FournisseurAdminResponse {
  fournisseurId: number;
  userId: number | null;
  nomSociete: string;
  email: string | null;
  blacklisted: boolean;
  blacklistMotif?: string | null;
  lieu?: string | null;
  adresse?: string | null;
  siteInternet?: string | null;
  gerant?: string | null;
}
