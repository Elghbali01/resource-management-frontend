import { useState, useEffect } from "react";
import type { DemandeCollecte } from "../../../types/demandeCollecte";
import type { Besoin } from "../../../types/besoin";
import { besoinChefService } from "../services/besoinChefService";
import { demandeCollecteService } from "../services/demandeCollecteService";
import BesoinCollectifForm from "./BesoinCollectifForm";
import BesoinsDemandeList from "./BesoinsDemandeList";

interface Props {
  demande: DemandeCollecte;
  onDemandeValidee: (demande: DemandeCollecte) => void;
}

export default function ConcertationPanel({ demande, onDemandeValidee }: Props) {
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [besoinsCollectifs, setBesoinsCollectifs] = useState<Besoin[]>([]);
  const [besoinToEdit, setBesoinToEdit] = useState<Besoin | null>(null);
  
  const [compteRendu, setCompteRendu] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  useEffect(() => {
    loadData();
  }, [demande.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [individuels, collectifs] = await Promise.all([
        besoinChefService.getBesoinsByDemande(demande.id),
        besoinChefService.getCollectifsByDemande(demande.id),
      ]);
      setBesoins(individuels);
      setBesoinsCollectifs(collectifs);
    } catch (err) {
      console.error("Erreur chargement concertation:", err);
      setErrorMsg("Erreur lors du chargement des données de concertation.");
    } finally {
      setLoading(false);
    }
  };

  const handleBesoinSubmitted = async () => {
    await loadData();
    setBesoinToEdit(null);
  };

  const handleDeleteCollectif = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce besoin collectif ?")) return;
    try {
      await besoinChefService.delete(id);
      await loadData();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const handleDeleteIndividuel = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce besoin individuel ?")) return;
    try {
      await besoinChefService.delete(id);
      await loadData();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const handleValiderDemande = async () => {
    try {
      setActionLoading(true);
      const updated = await demandeCollecteService.valider(demande.id, compteRendu);
      onDemandeValidee(updated);
    } catch (err: any) {
      const msg = err?.response?.data?.erreur || err?.response?.data?.message || "Erreur lors de la validation";
      setErrorMsg(msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="collecte-card mt-6">Chargement de l'espace de concertation...</div>;

  return (
    <div className="collecte-card mt-6 border-blue-200">
      <div className="collecte-card-header bg-blue-50/50">
        <h2>Concertation en cours : {demande.titre}</h2>
        <p>Réunissez-vous avec le département, ajoutez les besoins collectifs, et validez la collecte finale.</p>
      </div>

      <div className="p-0">
        {errorMsg && <div className="collecte-alert collecte-alert-error m-4">{errorMsg}</div>}

        <div className="m-4">
          <BesoinsDemandeList 
            besoins={besoins} 
            demandeTitre={demande.titre + " (Besoins Individuels)"} 
            hideCardStyle 
            onEdit={setBesoinToEdit} 
            onDelete={handleDeleteIndividuel} 
          />
        </div>

        <div className="m-4 border-t pt-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2">Besoins Collectifs</h3>
          {besoinsCollectifs.length > 0 ? (
             <BesoinsDemandeList besoins={besoinsCollectifs} demandeTitre={"Besoins Collectifs (Département)"} hideCardStyle onEdit={setBesoinToEdit} onDelete={handleDeleteCollectif} />
          ) : (
            <p className="text-sm text-gray-500 italic">Aucun besoin collectif pour l'instant.</p>
          )}

          <div className="mt-4">
             <BesoinCollectifForm
               demandeId={demande.id}
               onSubmitted={handleBesoinSubmitted}
               besoinToEdit={besoinToEdit}
               onCanceledEdit={() => setBesoinToEdit(null)}
             />
          </div>
        </div>

        <div className="m-4 border-t pt-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg text-gray-800 mb-2">Compte-rendu et Validation</h3>
          <p className="text-sm text-gray-600 mb-4">Saisissez la synthèse de la concertation avant de valider la demande définitivement.</p>
          
          <textarea
             className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300 mb-4"
             rows={4}
             placeholder="Notes, discussions, choix du matériel..."
             value={compteRendu}
             onChange={(e) => setCompteRendu(e.target.value)}
          ></textarea>

          <div className="flex justify-end">
             <button
               onClick={handleValiderDemande}
               disabled={actionLoading}
               className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md transition"
             >
               {actionLoading ? "En cours..." : "Valider la Collecte (Fixer)"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
