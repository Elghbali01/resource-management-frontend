import axios from "axios";

const API = "http://localhost:8080/api";

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

/**
 * Étape 1 : login classique (email + password)
 * Si hasDoubleRole == true, le front doit demander le rôle choisi
 * puis rappeler loginWithRole()
 */
export const login = (data: LoginRequest) =>
  axios.post<LoginResponse>(`${API}/auth/login`, data);

/**
 * Étape 2 (chef de département uniquement) :
 * Renvoi de la requête avec roleChoisi renseigné
 */
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
};

export const clearSession = () => {
  ["token", "role", "userId", "nom", "prenom"].forEach((k) =>
    localStorage.removeItem(k),
  );
};

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
