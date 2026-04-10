import { useState } from "react";
import "./Login.css";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const res = await login({ email, password });
      const role = res.data.role;

      switch (role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "CHEF_DEPARTEMENT":
          navigate("/chef");
          break;
        case "ENSEIGNANT":
          navigate("/enseignant");
          break;
        case "RESPONSABLE_RESOURCE":
          navigate("/responsable");
          break;
        case "FOURNISSEUR":
          navigate("/fournisseur");
          break;
        case "TECHNICIEN":
          navigate("/technicien");
          break;
        default:
          setError("Rôle utilisateur inconnu.");
      }
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

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
          <h2>Connexion</h2>
          <p className="login-subtitle">Accédez à votre espace de gestion</p>
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
              <span>Créez votre compte pour accéder aux appels d'offres.</span>
            </p>
            <button
              className="btn-secondary"
              onClick={() => navigate("/register")}
            >
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
