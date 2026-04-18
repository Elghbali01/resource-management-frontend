import { useState } from "react";
import type { DemandeCollecte } from "../../../types/demandeCollecte";
import type { AppelOffreResponse, CreateAppelOffreRequest } from "../../../types/appelOffre";
import { responsableService } from "../services/responsableService";

interface Props {
  demandes: DemandeCollecte[];
  onCreated: (ao: AppelOffreResponse) => void;
  onCancel: () => void;
}

export default function CreateAppelOffrePanel({ demandes, onCreated, onCancel }: Props) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [selectedDemandes, setSelectedDemandes] = useState<number[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggleDemande = (id: number) => {
    setSelectedDemandes(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDemandes.length === 0) {
      setError("Veuillez sélectionner au moins une demande.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const payload: CreateAppelOffreRequest = {
        titre,
        description: description || undefined,
        dateDebut,
        dateFin,
        demandeIds: selectedDemandes
      };

      const created = await responsableService.createAppelOffre(payload);
      onCreated(created);
    } catch (err: any) {
      const apiMessage = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors de la création de l'appel d'offre.";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 bg-blue-50/50 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Créer un Appel d'Offre</h2>
          <p className="text-sm text-gray-500">Regroupez plusieurs demandes en un seul appel d'offre.</p>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'appel d'offre *</label>
            <input 
              type="text" 
              required
              value={titre}
              onChange={e => setTitre(e.target.value)}
              placeholder="Ex: Matériel Informatique 2026..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Détails supplémentaires..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
              <input 
                type="date" 
                required
                value={dateDebut}
                onChange={e => setDateDebut(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
              <input 
                type="date" 
                required
                value={dateFin}
                onChange={e => setDateFin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-bold text-gray-900 mb-3">Sélectionnez les demandes à inclure ({selectedDemandes.length} sélectionnée(s)) *</label>
          {demandes.length === 0 ? (
             <p className="text-sm text-gray-500 italic">Aucune demande transmise disponible.</p>
          ) : (
             <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                {demandes.map(d => (
                  <label key={d.id} className="flex items-start p-3 hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedDemandes.includes(d.id)}
                      onChange={() => handleToggleDemande(d.id)}
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">{d.titre} - {d.departementNom}</span>
                      <span className="block text-xs text-gray-500">{d.nombreAffectationsPrevues} ressources prévues</span>
                    </div>
                  </label>
                ))}
             </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 border border-transparent rounded text-sm font-medium text-white hover:bg-blue-700">
            {loading ? "Création..." : "Générer l'Appel d'Offre"}
          </button>
        </div>
      </form>
    </div>
  );
}
