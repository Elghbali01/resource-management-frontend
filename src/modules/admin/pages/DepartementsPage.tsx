import React, { useEffect, useState, useMemo } from "react";
import {
  Building2,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import {
  departementService,
  type DepartementResponse,
  type DepartementRequest,
} from "../services/departementService";

// ─── Create Modal ───────────────────────────────────────────────────────────

interface CreateModalProps {
  onClose: () => void;
  onCreated: (dept: DepartementResponse) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose, onCreated }) => {
  const [form, setForm] = useState<DepartementRequest>({ nom: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nom.trim()) {
      setError("Le nom du département est obligatoire.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const created = await departementService.create(form);
      onCreated(created);
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Erreur lors de l'ajout.";
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
                Ajouter un département
              </h2>
              <p className="text-xs text-gray-500">Renseignez le nom</p>
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

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Nom du département <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => setForm({ nom: e.target.value })}
              required
              placeholder="ex: Informatique"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
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
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <Check className="w-4 h-4" />
              )}
              {loading ? "En cours…" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Edit Modal ──────────────────────────────────────────────────────────────

interface EditModalProps {
  departement: DepartementResponse;
  onClose: () => void;
  onSaved: (dept: DepartementResponse) => void;
}

const EditModal: React.FC<EditModalProps> = ({ departement, onClose, onSaved }) => {
  const [form, setForm] = useState<DepartementRequest>({ nom: departement.nom });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nom.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updated = await departementService.update(departement.id, form);
      onSaved(updated);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Erreur lors de la modification.";
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
              <Pencil className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Modifier le département</h2>
              <p className="text-xs text-gray-500">{departement.nom}</p>
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

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Nom du département <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => setForm({ nom: e.target.value })}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
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
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <Check className="w-4 h-4" />
              )}
              {loading ? "En cours…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ────────────────────────────────────────────────────

interface DeleteModalProps {
  departement: DepartementResponse;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  error?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ departement, onClose, onConfirm, loading, error }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
      <div className="px-6 pt-6 pb-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          Supprimer le département
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Êtes-vous sûr de vouloir supprimer{" "}
          <span className="font-medium text-gray-700">{departement.nom}</span> ?
        </p>
        
        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-left">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 px-6 pb-6 mt-2">
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
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

const DepartementsPage: React.FC = () => {
  const [departements, setDepartements] = useState<DepartementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editDept, setEditDept] = useState<DepartementResponse | null>(null);
  const [deleteDept, setDeleteDept] = useState<DepartementResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchDepartements = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await departementService.getAll();
      setDepartements(data);
    } catch {
      setError("Impossible de charger les départements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartements();
  }, []);

  const filtered = useMemo(() => {
    return departements.filter((d) => {
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        d.nom.toLowerCase().includes(q) ||
        (d.chefNom && d.chefNom.toLowerCase().includes(q)) ||
        (d.chefPrenom && d.chefPrenom.toLowerCase().includes(q))
      );
    });
  }, [departements, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedDepartements = useMemo(() => {
    return filtered.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filtered, currentPage]);

  const handleCreated = (newDept: DepartementResponse) => {
    setDepartements((prev) => [newDept, ...prev]);
    setShowCreateModal(false);
  };

  const handleEditSaved = (updated: DepartementResponse) => {
    setDepartements((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
    setEditDept(null);
  };

  const handleDelete = async () => {
    if (!deleteDept) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await departementService.delete(deleteDept.id);
      setDepartements((prev) => prev.filter((d) => d.id !== deleteDept.id));
      setDeleteDept(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erreur lors de la suppression.";
      setDeleteError(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            {/* L'utilisateur a demandé d'afficher "Gestion Utilisateurs" pour le titre */}
            <h1 className="text-xl font-bold text-gray-900">
              Gestion Utilisateurs
            </h1>
            <p className="text-sm text-gray-500">
              {departements.length} département{departements.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
          Ajouter un département
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un département, chef..."
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
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg
              className="animate-spin w-8 h-8 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-sm text-gray-400">Chargement des départements…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchDepartements}
              className="text-sm text-blue-600 hover:underline"
            >
              Réessayer
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Aucun département trouvé</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm text-blue-600 hover:underline"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                    Département
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                    Chef de Département
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                    Enseignants
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedDepartements.map((dept) => (
                  <tr
                    key={dept.id}
                    className="group hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {dept.nom.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {dept.nom}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {dept.chefNom ? (
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {dept.chefPrenom} {dept.chefNom}
                          </p>
                          <p className="text-xs text-gray-500">{dept.chefEmail}</p>
                        </div>
                      ) : (
                        <span className="text-xs italic text-gray-400">
                          Non assigné
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {dept.nombreEnseignants} enseignant{dept.nombreEnseignants > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditDept(dept)}
                          title="Modifier"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteDept(dept);
                            setDeleteError("");
                          }}
                          title="Supprimer"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
        />
      )}

      {editDept && (
        <EditModal
          departement={editDept}
          onClose={() => setEditDept(null)}
          onSaved={handleEditSaved}
        />
      )}

      {deleteDept && (
        <DeleteModal
          departement={deleteDept}
          onClose={() => {
            setDeleteDept(null);
            setDeleteError("");
          }}
          onConfirm={handleDelete}
          loading={deleteLoading}
          error={deleteError}
        />
      )}
    </div>
  );
};

export default DepartementsPage;
