import { useState } from "react";
import "./Register.css";
import { registerFournisseur } from "../../services/authService";
import { useNavigate } from "react-router-dom";

interface FormState {
  nomSociete: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    nomSociete: "",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const getPasswordStrength = (): { level: number; label: string } => {
    const p = form.password;
    if (!p) return { level: 0, label: "" };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 1, label: "Faible" };
    if (score <= 2) return { level: 2, label: "Moyen" };
    return { level: 3, label: "Fort" };
  };

  const strength = getPasswordStrength();

  const getStrengthClass = (bar: number) => {
    if (bar > strength.level) return "";
    if (strength.level === 1) return "reg-bar-weak";
    if (strength.level === 2) return "reg-bar-medium";
    return "reg-bar-strong";
  };

  const validate = (): boolean => {
    if (!form.nomSociete.trim()) {
      setError("Le nom de la société est requis.");
      return false;
    }
    if (!form.nom.trim() || !form.prenom.trim()) {
      setError("Nom et prénom sont requis.");
      return false;
    }
    if (!form.email.includes("@")) {
      setError("Adresse email invalide.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerFournisseur(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch {
      setError("Erreur lors de l'inscription. Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  };

  const filledFields = Object.values(form).filter(Boolean).length;
  const progressPct = Math.round((filledFields / 6) * 100);

  if (success) {
    return (
      <div className="reg-page">
        <div className="reg-shell">
          <div className="reg-side-panel">
            <div className="reg-brand-badge">GestRes</div>
            <div className="reg-brand-block">
              <h2>Inscription Fournisseur</h2>
              <p>Accédez aux appels d'offres et gérez vos soumissions facilement.</p>
            </div>
            <div className="reg-side-stats">
              <div className="reg-side-stat">
                <strong>Rapide</strong>
                <span>Création de compte en quelques étapes</span>
              </div>
              <div className="reg-side-stat">
                <strong>Sécurisé</strong>
                <span>Vos accès restent protégés</span>
              </div>
            </div>
          </div>

          <div className="reg-card reg-card--success">
            <div className="reg-success-state">
              <div className="reg-success-icon">✓</div>
              <h3>Inscription réussie !</h3>
              <p>
                Votre compte fournisseur a été créé avec succès.
                <br />
                Redirection vers la page de connexion…
              </p>
              <button
                type="button"
                className="reg-submit-btn"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-page">
      <div className="reg-shell">
        {/* ── SIDE PANEL ── */}
        <div className="reg-side-panel">
          <button
            type="button"
            className="reg-back-btn"
            onClick={() => navigate("/login")}
          >
            ← Retour à la connexion
          </button>

          <div className="reg-brand-block">
            <div className="reg-brand-badge">GestRes</div>
            <h2>Inscription Fournisseur</h2>
            <p>
              Créez votre compte pour accéder facilement aux appels d'offres
              et gérer vos soumissions en toute simplicité.
            </p>
          </div>

          <div className="reg-side-stats">
            <div className="reg-side-stat">
              <strong>Rapide</strong>
              <span>Création de compte en quelques étapes</span>
            </div>
            <div className="reg-side-stat">
              <strong>Sécurisé</strong>
              <span>Vos accès restent protégés</span>
            </div>
          </div>
        </div>

        {/* ── FORM CARD ── */}
        <div className="reg-card">
          <div className="reg-header">
            <h2>Créer mon compte</h2>
            <p>Complétez les informations ci-dessous</p>
          </div>

          <div className="reg-progress-bar">
            <div
              className="reg-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="reg-form-body">
            {error && (
              <div className="reg-error-msg">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Société */}
            <div className="reg-section-label">Informations société</div>
            <div className="reg-field">
              <label htmlFor="nomSociete">
                Nom de la société <span className="reg-required">*</span>
              </label>
              <input
                id="nomSociete"
                name="nomSociete"
                placeholder="Ex : TechnoSup SARL"
                value={form.nomSociete}
                onChange={handleChange}
                className={form.nomSociete.trim().length > 1 ? "reg-valid" : ""}
              />
            </div>

            {/* Responsable */}
            <div className="reg-section-label">Responsable</div>
            <div className="reg-field-grid">
              <div className="reg-field">
                <label htmlFor="nom">
                  Nom <span className="reg-required">*</span>
                </label>
                <input
                  id="nom"
                  name="nom"
                  placeholder="Dupont"
                  value={form.nom}
                  onChange={handleChange}
                  className={form.nom.trim().length > 1 ? "reg-valid" : ""}
                />
              </div>

              <div className="reg-field">
                <label htmlFor="prenom">
                  Prénom <span className="reg-required">*</span>
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  placeholder="Jean"
                  value={form.prenom}
                  onChange={handleChange}
                  className={form.prenom.trim().length > 1 ? "reg-valid" : ""}
                />
              </div>

              <div className="reg-field reg-field--full">
                <label htmlFor="reg-email">
                  Email professionnel <span className="reg-required">*</span>
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="contact@societe.ma"
                  value={form.email}
                  onChange={handleChange}
                  className={form.email.includes("@") ? "reg-valid" : ""}
                />
              </div>
            </div>

            {/* Sécurité */}
            <div className="reg-section-label">Sécurité du compte</div>

            <div className="reg-field">
              <label htmlFor="reg-password">
                Mot de passe <span className="reg-required">*</span>
              </label>
              <div className="reg-input-wrap">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 caractères"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="reg-icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Afficher ou masquer le mot de passe"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {form.password && (
                <div className="reg-pw-strength">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className={`reg-strength-bar ${getStrengthClass(bar)}`}
                    />
                  ))}
                  <span className="reg-strength-text">{strength.label}</span>
                </div>
              )}
            </div>

            <div className="reg-field">
              <label htmlFor="confirmPassword">
                Confirmer le mot de passe <span className="reg-required">*</span>
              </label>
              <div className="reg-input-wrap">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Répétez le mot de passe"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={
                    form.confirmPassword && form.password === form.confirmPassword
                      ? "reg-valid"
                      : form.confirmPassword
                        ? "reg-error-input"
                        : ""
                  }
                />
                <button
                  type="button"
                  className="reg-icon-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Afficher ou masquer la confirmation"
                >
                  {showConfirm ? "🙈" : "👁"}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="reg-hint reg-hint--error">
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            <button
              type="button"
              className="reg-submit-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Inscription en cours…" : "Créer mon compte"}
            </button>

            <div className="reg-login-link">
              Déjà un compte ?
              <button type="button" onClick={() => navigate("/login")}>
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}