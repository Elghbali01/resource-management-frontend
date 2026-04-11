// src/hooks/useAuth.ts
export function useAuth() {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    nom: localStorage.getItem("nom") ?? "",
    prenom: localStorage.getItem("prenom") ?? "",
  };
}
