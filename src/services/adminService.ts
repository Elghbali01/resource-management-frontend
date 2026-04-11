import axios from "axios";

const API = "http://localhost:8080/api";

// ── Axios instance with JWT ───────────────────────────────────────────────────
const axiosAuth = axios.create({ baseURL: API });
axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Types ─────────────────────────────────────────────────────────────────────
export interface UserListResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  status: string;
  departementNom?: string;
}

export interface CreateUserRequest {
  nom: string;
  prenom: string;
  email: string;
  role: string;
  departementId?: number | null;
}

export interface UpdateUserRequest {
  nom: string;
  prenom: string;
  email: string;
}

export interface DepartementResponse {
  id: number;
  nom: string;
}

// ── Calls ─────────────────────────────────────────────────────────────────────
export const getUsers = () => axiosAuth.get<UserListResponse[]>("/admin/users");

export const createUser = (data: CreateUserRequest) =>
  axiosAuth.post<UserListResponse>("/admin/users", data);

export const updateUser = (id: number, data: UpdateUserRequest) =>
  axiosAuth.put<UserListResponse>(`/admin/users/${id}`, data);

export const toggleUserStatus = (id: number) =>
  axiosAuth.patch<UserListResponse>(`/admin/users/${id}/toggle-statut`);

export const deleteUser = (id: number) =>
  axiosAuth.delete(`/admin/users/${id}`);

export const getDepartements = () =>
  axiosAuth.get<DepartementResponse[]>("/departements");
