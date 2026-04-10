import axios from "axios";

const API = "http://localhost:8080/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  role: string;
  token?: string;
}

export const login = (data: LoginRequest) => {
  return axios.post<LoginResponse>(`${API}/auth/login`, data);
};

export interface RegisterRequest {
  nomSociete: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerFournisseur = (data: RegisterRequest) => {
  return axios.post(`${API}/fournisseurs/inscription`, data);
};
