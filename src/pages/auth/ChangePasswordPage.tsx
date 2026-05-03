// src/pages/auth/ChangePasswordPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword, markPasswordChanged, getRole } from "../../services/authService";
import "./ChangePasswordPage.css";

/**
 * Page de changement de mot de passe.
 *
 * Comportement selon le contexte :
 *   - forced=true  → mustChangePassword=true dans localStorage → pas de bouton retour,
 *                    succès redirige vers le dashboard du rôle courant.
 *   - forced=false → ouvert depuis les Paramètres → bouton retour disponible,
 *                    succès affiche un toast de confirmation (pas de redirection).
 */

const ROLE_DASHBOARD: Record<string, string> = {
  ADMIN: "/admin",
  CHEF_DEPARTEMENT: "/chef",
  ENSEIGNANT: "/enseignant",
  RESPONSABLE_RESOURCE: "/responsable",
  FOURNISSEUR: "/fournisseur",
  TECHNICIEN: "/technicien",
};

// Calcule la force du mot de passe (0-4)
function getStrength(pwd: string): number {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

const STRENGTH_LABELS = ["", "Faible", "Moyen", "Bien", "Fort"];
const STRENGTH_COLORS = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const role = getRole() ?? "";

  // Détermine si le changement est obligatoire
  const forced = localStorage.getItem("mustChangePassword") === "true";

  const [ancien, setAncien] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [confirmer, setConfirmer] = useState("");

  const [showAncien, setShowAncien] = useState(false);
  const [showNouveau, setShowNouveau] = useState(false);
  const [showConfirmer, setShowConfirmer] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getStrength(nouveau);
  const strengthPct = nouveau.length === 0 ? 0 : (strength / 4) * 100;

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // Validations côté client
    if (!ancien || !nouveau || !confirmer) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (nouveau.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (nouveau !== confirmer) {
      setError("La confirmation ne correspond pas au nouveau mot de passe.");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        ancienMotDePasse: ancien,
        nouveauMotDePasse: nouveau,
        confirmerMotDePasse: confirmer,
      });

      // Succès → marquer comme changé
      markPasswordChanged();

      if (forced) {
        // Rediriger vers le dashboard du rôle
        const dashboard = ROLE_DASHBOARD[role] ?? "/login";
        navigate(dashboard, { replace: true });
      } else {
        // Mode optionnel → afficher une confirmation
        setSuccess("✅ Mot de passe changé avec succès !");
        setAncien("");
        setNouveau("");
        setConfirmer("");
      }
    } catch (err: unknown) {
      // Afficher le message d'erreur retourné par le back-end
      const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
      const msg =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.error ||
        "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const dashboard = ROLE_DASHBOARD[role] ?? "/login";
    navigate(dashboard);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="cp-page">
      <div className="cp-card">
        {/* ── Header ── */}
        <div className="cp-header">
          <div className="cp-icon-wrap">🔐</div>
          <h2>Changer mon mot de passe</h2>
          <p>
            {forced
              ? "Pour des raisons de sécurité, vous devez définir un nouveau mot de passe."
              : "Mettez à jour votre mot de passe pour sécuriser votre compte."}
          </p>
        </div>

        {/* ── Bannière avertissement si forcé ── */}
        {forced && (
          <div className="cp-warning-banner">
            <span className="cp-warn-icon">⚠️</span>
            <span>
              <strong>Action requise :</strong> Vous devez changer votre mot de
              passe avant de pouvoir accéder à votre espace de travail.
            </span>
          </div>
        )}

        {/* ── Formulaire ── */}
        <div className="cp-form">
          {/* Ancien mot de passe */}
          <div className="cp-field">
            <label htmlFor="cp-ancien">Ancien mot de passe</label>
            <div className="cp-input-wrap">
              <input
                id="cp-ancien"
                type={showAncien ? "text" : "password"}
                placeholder="••••••••"
                value={ancien}
                onChange={(e) => setAncien(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="cp-eye-btn"
                onClick={() => setShowAncien(!showAncien)}
                aria-label="Afficher/masquer"
              >
                {showAncien ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div className="cp-field">
            <label htmlFor="cp-nouveau">Nouveau mot de passe</label>
            <div className="cp-input-wrap">
              <input
                id="cp-nouveau"
                type={showNouveau ? "text" : "password"}
                placeholder="Min. 8 caractères"
                value={nouveau}
                onChange={(e) => setNouveau(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="cp-eye-btn"
                onClick={() => setShowNouveau(!showNouveau)}
                aria-label="Afficher/masquer"
              >
                {showNouveau ? "🙈" : "👁"}
              </button>
            </div>
            {/* Barre de force */}
            {nouveau.length > 0 && (
              <>
                <div className="cp-strength-bar">
                  <div
                    className="cp-strength-fill"
                    style={{
                      width: `${strengthPct}%`,
                      backgroundColor: STRENGTH_COLORS[strength],
                    }}
                  />
                </div>
                <div className="cp-strength-label">
                  Force : {STRENGTH_LABELS[strength] || "Trop court"}
                </div>
              </>
            )}
          </div>

          {/* Confirmer le nouveau mot de passe */}
          <div className="cp-field">
            <label htmlFor="cp-confirmer">Confirmer le nouveau mot de passe</label>
            <div className="cp-input-wrap">
              <input
                id="cp-confirmer"
                type={showConfirmer ? "text" : "password"}
                placeholder="••••••••"
                value={confirmer}
                onChange={(e) => setConfirmer(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="cp-eye-btn"
                onClick={() => setShowConfirmer(!showConfirmer)}
                aria-label="Afficher/masquer"
              >
                {showConfirmer ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          {error && (
            <div className="cp-error" role="alert">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="cp-success" role="status">
              <span>{success}</span>
            </div>
          )}

          {/* ── Bouton soumettre ── */}
          <button
            className="cp-btn-submit"
            onClick={handleSubmit}
            disabled={loading}
            id="cp-submit-btn"
          >
            {loading ? "Changement en cours…" : "Changer le mot de passe"}
          </button>

          {/* ── Bouton retour (seulement si non forcé) ── */}
          {!forced && (
            <button className="cp-back-btn" onClick={handleBack} id="cp-back-btn">
              ← Retour au tableau de bord
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
