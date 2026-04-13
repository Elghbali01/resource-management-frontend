import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Pencil,
  Trash2,
  ShieldOff,
  ShieldCheck,
  X,
  Check,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import {
  userService,
  type UserListResponse,
  type UpdateUserRequest,
  type CreateUserRequest,
} from "../services/userService";
import { ROLES } from "../../../utils/roles";
import { departementService } from "../services/departementService";

interface Departement {
  id: number;
  nom: string;
}

// ─── Role config ────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  CHEF_DEPARTEMENT: "Chef Département",
  ENSEIGNANT: "Enseignant",
  RESPONSABLE_RESOURCE: "Resp. Ressource",
  FOURNISSEUR: "Fournisseur",
  TECHNICIEN: "Technicien",
};

const ROLE_COLORS: Record<string, string> = {
  CHEF_DEPARTEMENT: "bg-violet-100 text-violet-700 border border-violet-200",
  ENSEIGNANT: "bg-blue-100 text-blue-700 border border-blue-200",
  RESPONSABLE_RESOURCE: "bg-amber-100 text-amber-700 border border-amber-200",
  FOURNISSEUR: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  TECHNICIEN: "bg-rose-100 text-rose-700 border border-rose-200",
};

const ALL_ROLES = Object.keys(ROLE_LABELS);

// ─── Sub-components ─────────────────────────────────────────────────────────

const RoleBadge: React.FC<{ role: string }> = ({ role }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      ROLE_COLORS[role] ?? "bg-gray-100 text-gray-600"
    }`}
  >
    {ROLE_LABELS[role] ?? role}
  </span>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const active =
    status?.toUpperCase() === "ACTIF" || status?.toUpperCase() === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        active
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-red-100 text-red-700 border border-red-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {active ? "Actif" : "Bloqué"}
    </span>
  );
};

// ─── Create Modal ───────────────────────────────────────────────────────────

interface CreateModalProps {
  onClose: () => void;
  onCreated: (user: UserListResponse) => void;
  departements: Departement[];
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose, onCreated, departements }) => {
  const [form, setForm] = useState<CreateUserRequest>({
    nom: "",
    prenom: "",
    email: "",
    role: "",
    departementId: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nom.trim() || !form.prenom.trim() || !form.email.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!form.role) {
      setError("Veuillez sélectionner un rôle.");
      return;
    }

    if ((form.role === "ENSEIGNANT" || form.role === "CHEF_DEPARTEMENT") && !form.departementId) {
      setError("Veuillez sélectionner un département.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = { ...form };
      if (payload.role !== "ENSEIGNANT" && payload.role !== "CHEF_DEPARTEMENT") {
        delete payload.departementId;
      }
      
      const created = await userService.create(payload);
      onCreated(created);
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Erreur lors de l'ajout. Vérifiez les informations.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Plus className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Ajouter un utilisateur
              </h2>
              <p className="text-xs text-gray-500">
                Remplissez les informations ci-dessous
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Nom <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
                placeholder="Dupont"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Prénom <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                required
                placeholder="Jean"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Email professionnel <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="contact@gestres.ma"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Rôle <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
                className="appearance-none w-full px-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer text-gray-700 bg-white"
              >
                <option value="">Sélectionner un rôle…</option>
                {ALL_ROLES.filter((r) => r !== ROLES.FOURNISSEUR).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {(form.role === "ENSEIGNANT" || form.role === "CHEF_DEPARTEMENT") && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Département <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.departementId || ""}
                  onChange={(e) => setForm({ ...form, departementId: Number(e.target.value) })}
                  required
                  className="appearance-none w-full px-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer text-gray-700 bg-white"
                >
                  <option value="">Sélectionner un département…</option>
                  {departements.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nom}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading ? (
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                <Check className="w-4 h-4" />
              )}
              {loading ? "Ajout en cours…" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Edit Modal ──────────────────────────────────────────────────────────────

interface EditModalProps {
  user: UserListResponse;
  onClose: () => void;
  onSaved: (updated: UserListResponse) => void;
}

const EditModal: React.FC<EditModalProps> = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState<UpdateUserRequest>({
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const updated = await userService.update(user.id, form);
      onSaved(updated);
    } catch {
      setError("Erreur lors de la modification. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Pencil className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Modifier l'utilisateur
              </h2>
              <p className="text-xs text-gray-500">
                {user.prenom} {user.nom}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Nom
              </label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="Nom"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Prénom
              </label>
              <input
                type="text"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder="Prénom"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              placeholder="email@example.com"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading ? (
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                <Check className="w-4 h-4" />
              )}
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ────────────────────────────────────────────────────

interface DeleteModalProps {
  user: UserListResponse;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  user,
  onClose,
  onConfirm,
  loading,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
      <div className="px-6 pt-6 pb-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          Supprimer l'utilisateur
        </h2>
        <p className="text-sm text-gray-500">
          Êtes-vous sûr de vouloir supprimer{" "}
          <span className="font-medium text-gray-700">
            {user.prenom} {user.nom}
          </span>{" "}
          ? Cette action est irréversible.
        </p>
      </div>
      <div className="flex gap-3 px-6 pb-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
        >
          {loading && (
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          )}
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserListResponse[]>([]);
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<UserListResponse | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserListResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedRole]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersData, deptsData] = await Promise.all([
        userService.getAll(),
        departementService.getAll().catch(() => [])
      ]);
      setUsers(usersData.filter((u) => u.role !== "ADMIN"));
      setDepartements(deptsData);
    } catch {
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        u.nom.toLowerCase().includes(q) ||
        u.prenom.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRole = !selectedRole || u.role === selectedRole;
      return matchSearch && matchRole;
    });
  }, [users, search, selectedRole]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    return filtered.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filtered, currentPage]);

  const handleCreated = (newUser: UserListResponse) => {
    setUsers((prev) => [newUser, ...prev]);
    setShowCreateModal(false);
  };

  const handleEditSaved = (updated: UserListResponse) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditUser(null);
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    try {
      await userService.delete(deleteUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async (user: UserListResponse) => {
    setTogglingId(user.id);
    try {
      const updated = await userService.toggleStatus(user.id);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch {
      alert("Erreur lors du changement de statut.");
    } finally {
      setTogglingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const actifs = users.filter(
      (u) =>
        u.status?.toUpperCase() === "ACTIF" ||
        u.status?.toUpperCase() === "ACTIVE"
    ).length;
    return { total, actifs, bloques: total - actifs };
  }, [users]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Gestion Utilisateurs
            </h1>
            <p className="text-sm text-gray-500">
              {stats.total} utilisateur{stats.total > 1 ? "s" : ""} ·{" "}
              {stats.actifs} actif{stats.actifs > 1 ? "s" : ""} ·{" "}
              {stats.bloques} bloqué{stats.bloques > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
          Ajouter un utilisateur
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, prénom, email…"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer text-gray-700"
          >
            <option value="">Tous les rôles</option>
            {ALL_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg
              className="animate-spin w-8 h-8 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <p className="text-sm text-gray-400">
              Chargement des utilisateurs…
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchData}
              className="text-sm text-blue-600 hover:underline"
            >
              Réessayer
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Aucun utilisateur trouvé</p>
            {(search || selectedRole) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedRole("");
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                    Nom
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                    Prénom
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                    Email
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                    Rôle
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                    Statut
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedUsers.map((user) => {
                  const isActive =
                    user.status?.toUpperCase() === "ACTIF" ||
                    user.status?.toUpperCase() === "ACTIVE";
                  const isToggling = togglingId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="group hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.nom.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {user.nom}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {user.prenom}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-5 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditUser(user)}
                            title="Modifier"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggle(user)}
                            disabled={isToggling}
                            title={isActive ? "Bloquer" : "Débloquer"}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 ${
                              isActive
                                ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                                : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {isToggling ? (
                              <svg
                                className="animate-spin w-3.5 h-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8z"
                                />
                              </svg>
                            ) : isActive ? (
                              <ShieldOff className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => setDeleteUser(user)}
                            title="Supprimer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-gray-500 font-medium">
                Affichage de{" "}
                {filtered.length === 0
                  ? 0
                  : (currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
                à {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} sur{" "}
                <span className="font-bold">{filtered.length}</span> résultat
                {filtered.length > 1 ? "s" : ""}
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Précédent
                  </button>
                  <span className="text-xs font-medium text-gray-500 px-2">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
          departements={departements}
        />
      )}

      {editUser && (
        <EditModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSaved={handleEditSaved}
        />
      )}

      {deleteUser && (
        <DeleteModal
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default UsersPage;
