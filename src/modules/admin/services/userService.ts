import api from "../../../services/api";

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
  departementId?: number;
}

export interface UpdateUserRequest {
  nom: string;
  prenom: string;
  email: string;
}

const BASE = "/admin/users";

export const userService = {
  getAll: (): Promise<UserListResponse[]> => api.get(BASE).then((r) => r.data),

  create: (data: CreateUserRequest): Promise<UserListResponse> =>
    api.post(BASE, data).then((r) => r.data),

  update: (id: number, data: UpdateUserRequest): Promise<UserListResponse> =>
    api.put(`${BASE}/${id}`, data).then((r) => r.data),

  toggleStatus: (id: number): Promise<UserListResponse> =>
    api.patch(`${BASE}/${id}/toggle-statut`).then((r) => r.data),

  delete: (id: number): Promise<{ message: string }> =>
    api.delete(`${BASE}/${id}`).then((r) => r.data),
};
