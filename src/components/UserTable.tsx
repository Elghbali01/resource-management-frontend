import "./UserTable.css";

export interface UserRow {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  status: string;
  departementNom?: string;
}

interface UserTableProps {
  users: UserRow[];
  onEdit: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
  onToggleStatus: (user: UserRow) => void;
  loading?: boolean;
}

const roleLabels: Record<string, string> = {
  ENSEIGNANT: "Enseignant",
  CHEF_DEPARTEMENT: "Chef Département",
  RESPONSABLE_RESOURCE: "Responsable",
  TECHNICIEN: "Technicien",
  FOURNISSEUR: "Fournisseur",
};

const roleBadgeClass: Record<string, string> = {
  ENSEIGNANT: "badge-blue",
  CHEF_DEPARTEMENT: "badge-purple",
  RESPONSABLE_RESOURCE: "badge-teal",
  TECHNICIEN: "badge-orange",
  FOURNISSEUR: "badge-gray",
};

export default function UserTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  loading = false,
}: UserTableProps) {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="table-spinner" />
        <span>Chargement des utilisateurs…</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="table-empty">
        <div className="table-empty-icon">👥</div>
        <p>Aucun utilisateur trouvé</p>
      </div>
    );
  }

  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Département</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {/* Nom + Prénom avec avatar */}
              <td>
                <div className="user-cell">
                  <div className="user-cell-avatar">
                    {user.prenom.charAt(0)}
                    {user.nom.charAt(0)}
                  </div>
                  <div className="user-cell-info">
                    <span className="user-cell-name">
                      {user.prenom} {user.nom}
                    </span>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td>
                <span className="table-email">{user.email}</span>
              </td>

              {/* Rôle */}
              <td>
                <span
                  className={`role-badge ${roleBadgeClass[user.role] ?? "badge-gray"}`}
                >
                  {roleLabels[user.role] ?? user.role}
                </span>
              </td>

              {/* Département */}
              <td>
                <span className="table-dept">{user.departementNom ?? "—"}</span>
              </td>

              {/* Statut */}
              <td>
                <span
                  className={`status-badge ${user.status === "ACTIVE" ? "status-active" : "status-inactive"}`}
                >
                  {user.status === "ACTIVE" ? "Actif" : "Bloqué"}
                </span>
              </td>

              {/* Actions */}
              <td>
                <div className="action-btns">
                  <button
                    className="action-btn action-edit"
                    title="Modifier"
                    onClick={() => onEdit(user)}
                  >
                    ✏️
                  </button>
                  <button
                    className={`action-btn ${user.status === "ACTIVE" ? "action-block" : "action-unblock"}`}
                    title={user.status === "ACTIVE" ? "Bloquer" : "Débloquer"}
                    onClick={() => onToggleStatus(user)}
                  >
                    {user.status === "ACTIVE" ? "🔒" : "🔓"}
                  </button>
                  <button
                    className="action-btn action-delete"
                    title="Supprimer"
                    onClick={() => onDelete(user)}
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
