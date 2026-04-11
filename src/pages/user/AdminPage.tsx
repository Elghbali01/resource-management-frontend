import { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/layout/Sidebar";
import type { NavItem } from "../../components/layout/Sidebar";
import UserTable from "../../components/UserTable";
import type { UserRow } from "../../components/UserTable";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getDepartements,
} from "../../services/adminService";
import type {
  DepartementResponse,
  UpdateUserRequest,
} from "../../services/adminService";
import "./AdminPage.css";

const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", path: "/admin", icon: "📊" },
  { label: "Utilisateurs", path: "/admin/users", icon: "👥" },
  { label: "Départements", path: "/admin/departements", icon: "🏛️" },
  { label: "Ressources", path: "/admin/ressources", icon: "📦" },
  { label: "Appels d'offres", path: "/admin/offres", icon: "📋" },
  { label: "Maintenance", path: "/admin/maintenance", icon: "🔧" },
  { label: "Paramètres", path: "/admin/parametres", icon: "⚙️" },
];

const ROLES_FILTER = [
  { value: "ALL", label: "Tous" },
  { value: "ENSEIGNANT", label: "Enseignants" },
  { value: "CHEF_DEPARTEMENT", label: "Chefs dept." },
  { value: "RESPONSABLE_RESOURCE", label: "Responsables" },
  { value: "TECHNICIEN", label: "Techniciens" },
  { value: "FOURNISSEUR", label: "Fournisseurs" },
];

const ROLES_CREATE = [
  { value: "ENSEIGNANT", label: "Enseignant" },
  { value: "CHEF_DEPARTEMENT", label: "Chef de département" },
  { value: "RESPONSABLE_RESOURCE", label: "Responsable Ressources" },
  { value: "TECHNICIEN", label: "Technicien" },
];

type ModalMode = "add" | "edit" | "delete" | null;

interface FormState {
  nom: string;
  prenom: string;
  email: string;
  role: string;
  departementId: string;
}
const EMPTY: FormState = {
  nom: "",
  prenom: "",
  email: "",
  role: "",
  departementId: "",
};

const needsDept = (role: string) =>
  role === "ENSEIGNANT" || role === "CHEF_DEPARTEMENT";

export default function AdminPage() {
  const nom = localStorage.getItem("nom") ?? "Admin";
  const prenom = localStorage.getItem("prenom") ?? "Super";

  const [users, setUsers] = useState<UserRow[]>([]);
  const [departements, setDepartements] = useState<DepartementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [activeTab, setActiveTab] = useState<"stats" | "users">("stats");
  const [filterRole, setFilterRole] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getUsers(), getDepartements()])
      .then(([u, d]) => {
        setUsers(u.data);
        setDepartements(d.data);
      })
      .catch(() => setApiError("Erreur de chargement."))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        const matchRole = filterRole === "ALL" || u.role === filterRole;
        const q = searchQuery.toLowerCase();
        const matchSearch =
          !q ||
          u.nom.toLowerCase().includes(q) ||
          u.prenom.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q);
        return matchRole && matchSearch;
      }),
    [users, filterRole, searchQuery],
  );

  const stats = useMemo(
    () => ({
      total: users.length,
      actifs: users.filter((u) => u.status === "ACTIVE").length,
      bloques: users.filter((u) => u.status === "INACTIVE").length,
      enseignants: users.filter((u) => u.role === "ENSEIGNANT").length,
      chefs: users.filter((u) => u.role === "CHEF_DEPARTEMENT").length,
      responsables: users.filter((u) => u.role === "RESPONSABLE_RESOURCE")
        .length,
      techniciens: users.filter((u) => u.role === "TECHNICIEN").length,
      fournisseurs: users.filter((u) => u.role === "FOURNISSEUR").length,
    }),
    [users],
  );

  const navItems = NAV_ITEMS.map((i) =>
    i.label === "Utilisateurs" ? { ...i, badge: users.length } : i,
  );

  const openAdd = () => {
    setForm(EMPTY);
    setFormError("");
    setSelectedUser(null);
    setModal("add");
  };
  const openEdit = (u: UserRow) => {
    setSelectedUser(u);
    setForm({
      nom: u.nom,
      prenom: u.prenom,
      email: u.email,
      role: u.role,
      departementId: "",
    });
    setFormError("");
    setModal("edit");
  };
  const openDelete = (u: UserRow) => {
    setSelectedUser(u);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelectedUser(null);
    setFormError("");
  };

  const validateForm = () => {
    if (!form.nom.trim()) {
      setFormError("Le nom est requis.");
      return false;
    }
    if (!form.prenom.trim()) {
      setFormError("Le prénom est requis.");
      return false;
    }
    if (!form.email.includes("@")) {
      setFormError("Email invalide.");
      return false;
    }
    if (modal === "add") {
      if (!form.role) {
        setFormError("Le rôle est requis.");
        return false;
      }
      if (needsDept(form.role) && !form.departementId) {
        setFormError("Le département est requis pour ce rôle.");
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    setFormError("");
    try {
      if (modal === "add") {
        const res = await createUser({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          role: form.role,
          departementId: needsDept(form.role)
            ? Number(form.departementId)
            : null,
        });
        setUsers((prev) => [...prev, res.data]);
      } else if (modal === "edit" && selectedUser) {
        const payload: UpdateUserRequest = {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
        };
        const res = await updateUser(selectedUser.id, payload);
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? res.data : u)),
        );
      }
      closeModal();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Une erreur est survenue.";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await deleteUser(selectedUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      closeModal();
    } catch {
      setFormError("Erreur lors de la suppression.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user: UserRow) => {
    try {
      const res = await toggleUserStatus(user.id);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
    } catch {
      setApiError("Erreur lors du changement de statut.");
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar role="ADMIN" nom={nom} prenom={prenom} navItems={navItems} />

      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div>
            <h1 className="admin-page-title">
              {activeTab === "stats"
                ? "Tableau de bord"
                : "Gestion des utilisateurs"}
            </h1>
            <p className="admin-page-sub">
              {activeTab === "stats"
                ? "Vue d'ensemble de la plateforme GestRes"
                : `${filteredUsers.length} utilisateur${filteredUsers.length > 1 ? "s" : ""} affiché${filteredUsers.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="topbar-tabs">
            <button
              className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              📊 Statistiques
            </button>
            <button
              className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              👥 Utilisateurs
            </button>
          </div>
        </header>

        {apiError && <div className="admin-alert">{apiError}</div>}

        {/* ── STATS TAB ── */}
        {activeTab === "stats" && (
          <div className="stats-section">
            <div className="kpi-grid">
              {[
                {
                  icon: "👥",
                  value: stats.total,
                  label: "Utilisateurs",
                  cls: "kpi-primary",
                },
                {
                  icon: "✅",
                  value: stats.actifs,
                  label: "Comptes actifs",
                  cls: "kpi-green",
                },
                {
                  icon: "🔒",
                  value: stats.bloques,
                  label: "Comptes bloqués",
                  cls: "kpi-red",
                },
                {
                  icon: "🏛️",
                  value: departements.length,
                  label: "Départements",
                  cls: "kpi-orange",
                },
              ].map((k) => (
                <div key={k.label} className={`kpi-card ${k.cls}`}>
                  <div className="kpi-icon">{k.icon}</div>
                  <div className="kpi-content">
                    <div className="kpi-value">{k.value}</div>
                    <div className="kpi-label">{k.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="stats-grid">
              {/* Barre par rôle */}
              <div className="stats-card">
                <h3 className="stats-card-title">Répartition par rôle</h3>
                <div className="role-stats">
                  {[
                    {
                      label: "Enseignants",
                      value: stats.enseignants,
                      color: "#3b82f6",
                    },
                    {
                      label: "Chefs dept.",
                      value: stats.chefs,
                      color: "#8b5cf6",
                    },
                    {
                      label: "Responsables",
                      value: stats.responsables,
                      color: "#0d9488",
                    },
                    {
                      label: "Techniciens",
                      value: stats.techniciens,
                      color: "#f59e0b",
                    },
                    {
                      label: "Fournisseurs",
                      value: stats.fournisseurs,
                      color: "#64748b",
                    },
                  ].map((item) => (
                    <div key={item.label} className="role-stat-row">
                      <span className="role-stat-label">{item.label}</span>
                      <div className="role-stat-bar-wrap">
                        <div
                          className="role-stat-bar"
                          style={{
                            width: stats.total
                              ? `${(item.value / stats.total) * 100}%`
                              : "0%",
                            background: item.color,
                          }}
                        />
                      </div>
                      <span className="role-stat-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donut */}
              <div className="stats-card">
                <h3 className="stats-card-title">Activité des comptes</h3>
                <div className="donut-wrap">
                  <svg viewBox="0 0 120 120" className="donut-svg">
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="16"
                    />
                    {stats.total > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r="46"
                        fill="none"
                        stroke="#1a3a6b"
                        strokeWidth="16"
                        strokeDasharray={`${(stats.actifs / stats.total) * 289} 289`}
                        strokeDashoffset="72"
                        strokeLinecap="round"
                      />
                    )}
                    <text
                      x="60"
                      y="56"
                      textAnchor="middle"
                      fontSize="18"
                      fontWeight="700"
                      fill="#1a2332"
                      fontFamily="Sora,sans-serif"
                    >
                      {stats.total > 0
                        ? Math.round((stats.actifs / stats.total) * 100)
                        : 0}
                      %
                    </text>
                    <text
                      x="60"
                      y="70"
                      textAnchor="middle"
                      fontSize="9"
                      fill="#64748b"
                      fontFamily="DM Sans,sans-serif"
                    >
                      actifs
                    </text>
                  </svg>
                  <div className="donut-legend">
                    <div className="donut-legend-item">
                      <span
                        className="donut-dot"
                        style={{ background: "#1a3a6b" }}
                      />
                      Actifs ({stats.actifs})
                    </div>
                    <div className="donut-legend-item">
                      <span
                        className="donut-dot"
                        style={{ background: "#e2e8f0" }}
                      />
                      Bloqués ({stats.bloques})
                    </div>
                  </div>
                </div>
                <button
                  className="btn-manage"
                  onClick={() => setActiveTab("users")}
                >
                  Gérer les utilisateurs →
                </button>
              </div>
            </div>

            {/* Récents */}
            <div className="recent-card">
              <div className="recent-header">
                <h3 className="stats-card-title" style={{ margin: 0 }}>
                  Utilisateurs récents
                </h3>
                <button
                  className="btn-manage"
                  onClick={() => setActiveTab("users")}
                >
                  Voir tous →
                </button>
              </div>
              <UserTable
                users={[...users].reverse().slice(0, 5)}
                onEdit={openEdit}
                onDelete={openDelete}
                onToggleStatus={handleToggleStatus}
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <div className="users-section">
            <div className="users-toolbar">
              <div className="toolbar-left">
                <input
                  className="search-input"
                  type="text"
                  placeholder="🔍  Rechercher…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="filter-chips">
                  {ROLES_FILTER.map((r) => (
                    <button
                      key={r.value}
                      className={`filter-chip ${filterRole === r.value ? "active" : ""}`}
                      onClick={() => setFilterRole(r.value)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <button className="btn-add" onClick={openAdd}>
                + Ajouter
              </button>
            </div>
            <UserTable
              users={filteredUsers}
              onEdit={openEdit}
              onDelete={openDelete}
              onToggleStatus={handleToggleStatus}
              loading={loading}
            />
          </div>
        )}
      </main>

      {/* ── MODAL ADD/EDIT ── */}
      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modal === "add"
                  ? "Ajouter un utilisateur"
                  : "Modifier l'utilisateur"}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {formError && <div className="modal-error">⚠ {formError}</div>}
              <div className="modal-grid">
                <div className="modal-field">
                  <label>
                    Nom <span className="req">*</span>
                  </label>
                  <input
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Bensalem"
                  />
                </div>
                <div className="modal-field">
                  <label>
                    Prénom <span className="req">*</span>
                  </label>
                  <input
                    value={form.prenom}
                    onChange={(e) =>
                      setForm({ ...form, prenom: e.target.value })
                    }
                    placeholder="Amina"
                  />
                </div>
                <div className="modal-field modal-field-full">
                  <label>
                    Email <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="nom@faculte.ma"
                  />
                </div>
                {modal === "add" && (
                  <>
                    <div className="modal-field modal-field-full">
                      <label>
                        Rôle <span className="req">*</span>
                      </label>
                      <select
                        value={form.role}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            role: e.target.value,
                            departementId: "",
                          })
                        }
                      >
                        <option value="">— Choisir un rôle —</option>
                        {ROLES_CREATE.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {needsDept(form.role) && (
                      <div className="modal-field modal-field-full">
                        <label>
                          Département <span className="req">*</span>
                        </label>
                        <select
                          value={form.departementId}
                          onChange={(e) =>
                            setForm({ ...form, departementId: e.target.value })
                          }
                        >
                          <option value="">— Choisir un département —</option>
                          {departements.map((d) => (
                            <option key={d.id} value={String(d.id)}>
                              {d.nom}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="modal-info">
                      <span>ℹ️</span> Un mot de passe temporaire sera envoyé
                      automatiquement par email.
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                Annuler
              </button>
              <button
                className="btn-confirm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Enregistrement…"
                  : modal === "add"
                    ? "Créer l'utilisateur"
                    : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DELETE ── */}
      {modal === "delete" && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmer la suppression</h2>
              <button className="modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {formError && <div className="modal-error">⚠ {formError}</div>}
              <p className="delete-text">
                Voulez-vous vraiment supprimer{" "}
                <strong>
                  {selectedUser.prenom} {selectedUser.nom}
                </strong>{" "}
                ?
                <br />
                <span className="delete-warn">
                  Cette action est irréversible.
                </span>
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                Annuler
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
