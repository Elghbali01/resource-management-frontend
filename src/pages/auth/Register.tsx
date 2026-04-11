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
    if (strength.level === 1) return "weak";
    if (strength.level === 2) return "medium";
    return "strong";
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
      <div className="register-container">
        <div className="register-box">
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h3>Inscription réussie !</h3>
            <p>
              Votre compte fournisseur a été créé avec succès.
              <br />
              Redirection vers la page de connexion…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-box">
        {/* ── HEADER ── */}
        <div className="register-header">
          <button className="back-btn" onClick={() => navigate("/login")}>
            ← Retour à la connexion
          </button>
          <h2>Inscription Fournisseur</h2>
          <p>Créez votre compte pour accéder aux appels d'offres</p>
        </div>

        {/* ── PROGRESS ── */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        {/* ── BODY ── */}
        <div className="register-body">
          {error && (
            <div
              className="error-msg"
              style={{
                background: "#fff1f1",
                border: "1px solid rgba(220,53,69,0.25)",
                borderRadius: "8px",
                color: "#c0392b",
                fontSize: "0.85rem",
                padding: "10px 14px",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚠</span> {error}
            </div>
          )}

          {/* Société */}
          <div className="section-label">Informations société</div>
          <div className="field">
            <label htmlFor="nomSociete">
              Nom de la société <span className="required">*</span>
            </label>
            <input
              id="nomSociete"
              name="nomSociete"
              placeholder="Ex : TechnoSup SARL"
              value={form.nomSociete}
              onChange={handleChange}
              className={form.nomSociete.trim().length > 1 ? "valid" : ""}
            />
          </div>

          {/* Identité */}
          <div className="section-label">Responsable</div>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="nom">
                Nom <span className="required">*</span>
              </label>
              <input
                id="nom"
                name="nom"
                placeholder="Dupont"
                value={form.nom}
                onChange={handleChange}
                className={form.nom.trim().length > 1 ? "valid" : ""}
              />
            </div>
            <div className="field">
              <label htmlFor="prenom">
                Prénom <span className="required">*</span>
              </label>
              <input
                id="prenom"
                name="prenom"
                placeholder="Jean"
                value={form.prenom}
                onChange={handleChange}
                className={form.prenom.trim().length > 1 ? "valid" : ""}
              />
            </div>

            <div className="field full">
              <label htmlFor="reg-email">
                Email professionnel <span className="required">*</span>
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="contact@societe.ma"
                value={form.email}
                onChange={handleChange}
                className={form.email.includes("@") ? "valid" : ""}
              />
            </div>
          </div>

          {/* Sécurité */}
          <div className="section-label">Sécurité du compte</div>
          <div className="field">
            <label htmlFor="reg-password">
              Mot de passe <span className="required">*</span>
            </label>
            <div className="input-wrap">
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
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {form.password && (
              <div className="password-strength">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`strength-bar ${getStrengthClass(bar)}`}
                  />
                ))}
                <span className="strength-text">{strength.label}</span>
              </div>
            )}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">
              Confirmer le mot de passe <span className="required">*</span>
            </label>
            <div className="input-wrap">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Répétez le mot de passe"
                value={form.confirmPassword}
                onChange={handleChange}
                className={
                  form.confirmPassword && form.password === form.confirmPassword
                    ? "valid"
                    : form.confirmPassword
                      ? "error"
                      : ""
                }
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "🙈" : "👁"}
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="field-hint error-text">
                Les mots de passe ne correspondent pas
              </p>
            )}
          </div>

          <button
            className="btn-register"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Inscription en cours…" : "Créer mon compte"}
          </button>

          <div className="login-link">
            Déjà un compte ?
            <button onClick={() => navigate("/login")}>Se connecter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
