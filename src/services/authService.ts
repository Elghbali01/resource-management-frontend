import axios from "axios";

const API = "/api";

// ── Axios instance with JWT interceptor ──────────────────────────────────────
const axiosAuth = axios.create({ baseURL: API });

axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Types ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
  roleChoisi?: string; // envoyé uniquement lors de l'étape 2 (chef de département)
}

export interface LoginResponse {
  token: string | null;
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string | null;
  hasDoubleRole: boolean; // true => afficher la popup de choix de rôle
  mustChangePassword: boolean; // true => forcer le changement de mot de passe
}

export interface ChangePasswordRequest {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
  confirmerMotDePasse: string;
}

export interface RegisterRequest {
  nomSociete: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ── Auth calls ────────────────────────────────────────────────────────────────

export const login = (data: LoginRequest) =>
  axios.post<LoginResponse>(`${API}/auth/login`, data);

export const loginWithRole = (
  email: string,
  password: string,
  roleChoisi: string,
) =>
  axios.post<LoginResponse>(`${API}/auth/login`, {
    email,
    password,
    roleChoisi,
  });

export const registerFournisseur = (data: RegisterRequest) =>
  axios.post(`${API}/fournisseurs/inscription`, data);

// ── Session helpers ───────────────────────────────────────────────────────────

export const saveSession = (response: LoginResponse) => {
  if (response.token) localStorage.setItem("token", response.token);
  localStorage.setItem("role", response.role ?? "");
  localStorage.setItem("userId", String(response.id));
  localStorage.setItem("nom", response.nom);
  localStorage.setItem("prenom", response.prenom);
  localStorage.setItem("mustChangePassword", String(response.mustChangePassword ?? false));
};

export const clearSession = () => {
  ["token", "role", "userId", "nom", "prenom", "mustChangePassword"].forEach(
    (k) => localStorage.removeItem(k),
  );
};

// Marque le mot de passe comme changé
export const markPasswordChanged = () => {
  localStorage.setItem("mustChangePassword", "false");
};

// Appel API changement de mot de passe
export const changePassword = (data: ChangePasswordRequest) =>
  axiosAuth.put(`/auth/change-password`, data);

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
