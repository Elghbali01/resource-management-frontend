import { useState } from "react";
import type { CreateDemandeCollecteRequest, DemandeCollecte } from "../../../types/demandeCollecte";
import { demandeCollecteService } from "../services/demandeCollecteService";

interface Props {
  onCreated: (demande: DemandeCollecte) => void;
}

export default function DemandeCollecteForm({ onCreated }: Props) {
  const [form, setForm] = useState<CreateDemandeCollecteRequest>({
    titre: "",
    description: "",
    dateLimite: "",
    statut: "OUVERTE",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.titre.trim() || !form.description.trim() || !form.dateLimite) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      setLoading(true);
      const created = await demandeCollecteService.create(form);
      onCreated(created);
      setSuccess("La demande de collecte a été créée avec succès.");
      setForm({
        titre: "",
        description: "",
        dateLimite: "",
        statut: "OUVERTE",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Erreur lors de la création de la demande."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="collecte-card">
      <div className="collecte-card-header">
        <h2>Créer une demande de collecte</h2>
        <p>Diffusez une nouvelle collecte de besoins à tous les enseignants du département.</p>
      </div>

      <form onSubmit={handleSubmit} className="collecte-form">
        {error && <div className="collecte-alert collecte-alert-error">{error}</div>}
        {success && <div className="collecte-alert collecte-alert-success">{success}</div>}

        <div className="collecte-field">
          <label>Titre</label>
          <input
            type="text"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            placeholder="Ex : Besoins en matériel 2026"
          />
        </div>

        <div className="collecte-field">
          <label>Description</label>
          <textarea
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            placeholder="Veuillez soumettre vos besoins avant la date limite."
          />
        </div>

        <div className="collecte-grid">
          <div className="collecte-field">
            <label>Date limite</label>
            <input
              type="date"
              name="dateLimite"
              value={form.dateLimite}
              onChange={handleChange}
            />
          </div>

          <div className="collecte-field">
            <label>Statut</label>
            <select name="statut" value={form.statut} onChange={handleChange}>
              <option value="OUVERTE">OUVERTE</option>
              <option value="BROUILLON">BROUILLON</option>
              <option value="FERMEE">FERMEE</option>
            </select>
          </div>
        </div>

        <button type="submit" className="collecte-btn-primary" disabled={loading}>
          {loading ? "Création..." : "Créer la demande"}
        </button>
      </form>
    </div>
  );
}
