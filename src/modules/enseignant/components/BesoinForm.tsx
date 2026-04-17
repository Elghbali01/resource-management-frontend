import { useState, useEffect } from "react";
import type { BesoinRequest, Besoin } from "../../../types/besoin";
import { besoinService } from "../services/besoinService";

interface Props {
  demandeId: number;
  onSubmitted: (nouveauBesoin: Besoin) => void;
  besoinToEdit?: Besoin | null;
  onCanceledEdit?: () => void;
}

export default function BesoinForm({ demandeId, onSubmitted, besoinToEdit, onCanceledEdit }: Props) {
  const [form, setForm] = useState<BesoinRequest>({
    demandeId,
    typeMateriel: "ORDINATEUR",
    quantite: 1,
    marqueSouhaitee: "",
    justification: "",
    cpu: "",
    ram: "",
    disqueDur: "",
    ecran: "",
    vitesseImpression: "",
    resolution: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (besoinToEdit) {
      setForm({
        demandeId: besoinToEdit.demandeId,
        typeMateriel: besoinToEdit.typeMateriel,
        quantite: besoinToEdit.quantite,
        marqueSouhaitee: besoinToEdit.marqueSouhaitee || "",
        justification: besoinToEdit.justification || "",
        cpu: besoinToEdit.cpu || "",
        ram: besoinToEdit.ram || "",
        disqueDur: besoinToEdit.disqueDur || "",
        ecran: besoinToEdit.ecran || "",
        vitesseImpression: besoinToEdit.vitesseImpression || "",
        resolution: besoinToEdit.resolution || "",
      });
      setError("");
      setSuccess("");
    } else {
      setForm((prev) => ({ ...prev, demandeId })); // sync when demande changes
    }
  }, [besoinToEdit, demandeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.quantite <= 0) {
      setError("La quantité doit être rééelle et supérieure à zéro.");
      return;
    }

    const basePayload = {
      demandeId: form.demandeId,
      typeMateriel: form.typeMateriel,
      quantite: Number(form.quantite),
      marqueSouhaitee: form.marqueSouhaitee,
      justification: form.justification,
    };
    
    const payload: any = { ...basePayload };
    if (form.typeMateriel === "ORDINATEUR") {
      payload.cpu = form.cpu;
      payload.ram = form.ram;
      payload.disqueDur = form.disqueDur;
      payload.ecran = form.ecran;
    } else {
      payload.vitesseImpression = form.vitesseImpression;
      payload.resolution = form.resolution;
    }

    console.log("Payload envoyé :", payload);

    try {
      setLoading(true);
      if (besoinToEdit) {
        const updated = await besoinService.update(besoinToEdit.id, payload);
        onSubmitted(updated);
        setSuccess("Besoin modifié avec succès.");
        if (onCanceledEdit) onCanceledEdit();
      } else {
        const created = await besoinService.create(payload);
        onSubmitted(created);
        setSuccess("Besoin soumis avec succès.");
        setForm({
          demandeId,
          typeMateriel: "ORDINATEUR",
          quantite: 1,
          marqueSouhaitee: "",
          justification: "",
          cpu: "",
          ram: "",
          disqueDur: "",
          ecran: "",
          vitesseImpression: "",
          resolution: "",
        });
      }
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.erreur ||
        err?.response?.data?.message ||
        "Erreur lors de l'enregistrement du besoin";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enseignant-card mt-6">
      <div className="enseignant-card-header">
        <h2>{besoinToEdit ? "Modifier un besoin" : "Soumettre un besoin"}</h2>
        <p>Veuillez détailler le matériel requis pour la collecte sélectionnée.</p>
      </div>

      <form onSubmit={handleSubmit} className="enseignant-form p-4 bg-white rounded-lg border border-gray-100 shadow-sm mt-4 space-y-4">
        {error && <div className="text-red-600 bg-red-50 p-2 text-sm rounded border border-red-200">{error}</div>}
        {success && <div className="text-green-600 bg-green-50 p-2 text-sm rounded border border-green-200">{success}</div>}

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de Matériel</label>
            <select
              name="typeMateriel"
              value={form.typeMateriel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="ORDINATEUR">Ordinateur</option>
              <option value="IMPRIMANTE">Imprimante</option>
            </select>
          </div>
          <div className="w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
            <input
              type="number"
              name="quantite"
              min={1}
              value={form.quantite}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marque Souhaitée</label>
          <input
            type="text"
            name="marqueSouhaitee"
            value={form.marqueSouhaitee}
            onChange={handleChange}
            placeholder="Ex: Dell, HP (Optionnel)"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {form.typeMateriel === "ORDINATEUR" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPU</label>
              <input
                type="text"
                name="cpu"
                value={form.cpu}
                onChange={handleChange}
                placeholder="Ex: i7"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RAM</label>
              <input
                type="text"
                name="ram"
                value={form.ram}
                onChange={handleChange}
                placeholder="Ex: 16 Go"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disque dur</label>
              <input
                type="text"
                name="disqueDur"
                value={form.disqueDur}
                onChange={handleChange}
                placeholder="Ex: 512 Go SSD"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Écran</label>
              <input
                type="text"
                name="ecran"
                value={form.ecran}
                onChange={handleChange}
                placeholder="Ex: 15 pouces"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
        )}

        {form.typeMateriel === "IMPRIMANTE" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vitesse d'impression</label>
              <input
                type="text"
                name="vitesseImpression"
                value={form.vitesseImpression}
                onChange={handleChange}
                placeholder="Ex: 20 ppm"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Résolution</label>
              <input
                type="text"
                name="resolution"
                value={form.resolution}
                onChange={handleChange}
                placeholder="Ex: 1200 dpi"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
        )}

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Justification du besoin</label>
           <textarea
             name="justification"
             rows={3}
             value={form.justification}
             onChange={handleChange}
             placeholder="Expliquez pourquoi vous avez besoin de ce matériel..."
             className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
           />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {besoinToEdit && (
            <button
              type="button"
              onClick={onCanceledEdit}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition"
          >
            {loading ? "En cours..." : (besoinToEdit ? "Mettre à jour" : "Soumettre")}
          </button>
        </div>
      </form>
    </div>
  );
}
