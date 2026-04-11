import { useState } from "react";
import "./Login.css";
import { login, loginWithRole, saveSession } from "../../services/authService";
import type { LoginResponse } from "../../services/authService";
import { useNavigate } from "react-router-dom";

type Step = "credentials" | "role-choice";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Étape 2 : choix du rôle pour le chef de département
  const [step, setStep] = useState<Step>("credentials");
  const [pendingUser, setPendingUser] = useState<LoginResponse | null>(null);
  const [roleChoisi, setRoleChoisi] = useState<string>("");

  const navigate = useNavigate();

  // ── Redirection selon le rôle ───────────────────────────────────────────────
  const redirectByRole = (role: string) => {
    switch (role) {
      case "ADMIN":
        return navigate("/admin");
      case "CHEF_DEPARTEMENT":
        return navigate("/chef");
      case "ENSEIGNANT":
        return navigate("/enseignant");
      case "RESPONSABLE_RESOURCE":
        return navigate("/responsable");
      case "FOURNISSEUR":
        return navigate("/fournisseur");
      case "TECHNICIEN":
        return navigate("/technicien");
      default:
        setError("Rôle utilisateur inconnu.");
    }
  };

  // ── Étape 1 : login email + password ───────────────────────────────────────
  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const res = await login({ email, password });
      const data = res.data;

      if (data.hasDoubleRole) {
        // Chef de département → afficher la popup de choix
        setPendingUser(data);
        setStep("role-choice");
      } else {
        // Rôle unique → sauvegarder et rediriger
        saveSession(data);
        redirectByRole(data.role!);
      }
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  // ── Étape 2 : confirmer le rôle choisi ─────────────────────────────────────
  const handleRoleConfirm = async () => {
    if (!roleChoisi) {
      setError("Veuillez choisir un rôle.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await loginWithRole(email, password, roleChoisi);
      saveSession(res.data);
      redirectByRole(res.data.role!);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    if (step === "credentials") {
      handleLogin();
    } else {
      handleRoleConfirm();
    }
  }
};

  // ── Rendu ───────────────────────────────────────────────────────────────────
  return (
    <div className="login-container">
      {/* ── LEFT PANEL ── */}
      <div className="login-left">
        <div className="brand-mark">
          <div className="brand-icon">🎓</div>
          <div className="brand-name">
            GestRes
            <span>Faculté des Sciences et Techniques Fes</span>
          </div>
        </div>

        <h1>
          Gestion des <em>ressources</em> matérielles
        </h1>
        <p>
          Plateforme centralisée pour les départements, responsables,
          techniciens et fournisseurs. Tout en un seul endroit.
        </p>

        <div className="stats-row">
          <div className="stat">
            <div className="stat-num">6</div>
            <div className="stat-label">Rôles</div>
          </div>
          <div className="stat">
            <div className="stat-num">∞</div>
            <div className="stat-label">Ressources</div>
          </div>
          <div className="stat">
            <div className="stat-num">100%</div>
            <div className="stat-label">Sécurisé</div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="login-right">
        <div className="login-box">
          {/* ════ ÉTAPE 1 : Formulaire de connexion ════ */}
          {step === "credentials" && (
            <>
              <h2>Connexion</h2>
              <p className="login-subtitle">
                Accédez à votre espace de gestion
              </p>

              {error && (
                <div className="error-msg">
                  <span>⚠</span>
                  {error}
                </div>
              )}

              <div className="field">
                <label htmlFor="email">Adresse email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="nom@faculte.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <div className="field-row">
                  <label htmlFor="password">Mot de passe</label>
                  <a href="#" className="forgot-link">
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="input-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Afficher/masquer le mot de passe"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <button
                className={`btn-primary${loading ? " loading" : ""}`}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Connexion en cours…" : "Se connecter"}
              </button>

              <div className="divider">ou</div>

              <div className="register-box">
                <p>
                  Vous êtes fournisseur ?
                  <span>
                    Créez votre compte pour accéder aux appels d'offres.
                  </span>
                </p>
                <button
                  className="btn-secondary"
                  onClick={() => navigate("/register")}
                >
                  S'inscrire
                </button>
              </div>
            </>
          )}

          {/* ════ ÉTAPE 2 : Choix du rôle — Chef de département ════ */}
          {step === "role-choice" && pendingUser && (
            <>
              <div className="role-choice-header">
                <div className="role-choice-avatar">
                  {pendingUser.prenom.charAt(0).toUpperCase()}
                  {pendingUser.nom.charAt(0).toUpperCase()}
                </div>
                <h2>
                  Bonjour, {pendingUser.prenom} {pendingUser.nom}
                </h2>
                <p className="login-subtitle">
                  Votre compte dispose de deux rôles. <br />
                  Avec quel profil souhaitez-vous vous connecter ?
                </p>
              </div>

              {error && (
                <div className="error-msg">
                  <span>⚠</span>
                  {error}
                </div>
              )}

              <div className="role-cards">
                {/* Carte Chef de département */}
                <button
                  className={`role-card${roleChoisi === "CHEF_DEPARTEMENT" ? " selected" : ""}`}
                  onClick={() => setRoleChoisi("CHEF_DEPARTEMENT")}
                >
                  <div className="role-card-icon">🏛️</div>
                  <div className="role-card-content">
                    <div className="role-card-title">Chef de département</div>
                    <div className="role-card-desc">
                      Gérez les ressources, validez les demandes et supervisez
                      votre département
                    </div>
                  </div>
                  <div className="role-card-check">
                    {roleChoisi === "CHEF_DEPARTEMENT" ? "✓" : ""}
                  </div>
                </button>

                {/* Carte Enseignant */}
                <button
                  className={`role-card${roleChoisi === "ENSEIGNANT" ? " selected" : ""}`}
                  onClick={() => setRoleChoisi("ENSEIGNANT")}
                >
                  <div className="role-card-icon">📚</div>
                  <div className="role-card-content">
                    <div className="role-card-title">Enseignant</div>
                    <div className="role-card-desc">
                      Soumettez des demandes de ressources et consultez vos
                      réservations
                    </div>
                  </div>
                  <div className="role-card-check">
                    {roleChoisi === "ENSEIGNANT" ? "✓" : ""}
                  </div>
                </button>
              </div>

              <button
                className={`btn-primary${loading ? " loading" : ""}${!roleChoisi ? " disabled-look" : ""}`}
                onClick={handleRoleConfirm}
                disabled={loading || !roleChoisi}
              >
                {loading ? "Connexion en cours…" : "Continuer"}
              </button>

              <button
                className="back-link"
                onClick={() => {
                  setStep("credentials");
                  setRoleChoisi("");
                  setError("");
                  setPendingUser(null);
                }}
              >
                ← Revenir à la connexion
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
