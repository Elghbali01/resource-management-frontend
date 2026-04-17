import { useEffect, useState } from "react";
import type { DemandeCollecte } from "../../../types/demandeCollecte";
import type { Besoin } from "../../../types/besoin";
import { demandeCollecteService } from "../services/demandeCollecteService";
import { besoinChefService } from "../services/besoinChefService";
import DemandeCollecteForm from "../components/DemandeCollecteForm";
import DemandeCollecteList from "../components/DemandeCollecteList";
import BesoinsDemandeList from "../components/BesoinsDemandeList";
import ConcertationPanel from "../components/ConcertationPanel";
import "./CollecteBesoinsPage.css";

export default function CollecteBesoinsPage() {
  const [demandes, setDemandes] = useState<DemandeCollecte[]>([]);
  const [loading, setLoading] = useState(true);
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [selectedDemandeTitre, setSelectedDemandeTitre] = useState<string | null>(null);
  const [consultingDemandeId, setConsultingDemandeId] = useState<number | null>(null);
  const [concertingDemande, setConcertingDemande] = useState<DemandeCollecte | null>(null);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadDemandes = async () => {
    try {
      setLoading(true);
      const data = await demandeCollecteService.getAll();
      setDemandes(data);
    } catch (error) {
      console.error("Erreur chargement demandes chef :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemandes();
  }, []);

  const handleCreated = (newDemande: DemandeCollecte) => {
    setDemandes((prev) => [newDemande, ...prev]);
  };

  const handleOpen = async (id: number) => {
    try {
      const updated = await demandeCollecteService.open(id);
      setDemandes((prev) => prev.map((d) => (d.id === id ? updated : d)));
      setErrorMsg("");
    } catch (error: any) {
      const apiMessage = error?.response?.data?.erreur || error?.response?.data?.message || error?.message || "Erreur lors de l'ouverture de la demande.";
      setErrorMsg(apiMessage);
    }
  };

  const handleClose = async (id: number) => {
    try {
      const updated = await demandeCollecteService.close(id);
      setDemandes((prev) => prev.map((d) => (d.id === id ? updated : d)));
      setErrorMsg("");
    } catch (error: any) {
      const apiMessage = error?.response?.data?.erreur || error?.response?.data?.message || error?.message || "Erreur lors de la fermeture de la demande.";
      setErrorMsg(apiMessage);
    }
  };

  const handleConsult = async (id: number) => {
    try {
      const demande = demandes.find((d) => d.id === id);
      if (demande) setSelectedDemandeTitre(demande.titre);
      
      // L'API getBesoinsByDemande remonte en réalité TOUS les besoins (individuels + collectifs)
      // Donc pas besoin d'ajouter les collectifs manuellement pour la vue historique globale
      const loadedBesoins = await besoinChefService.getBesoinsByDemande(id);
      setBesoins(loadedBesoins);
      
      setConsultingDemandeId(id);
      setConcertingDemande(null);
      setErrorMsg("");
    } catch (error: any) {
      const apiMessage = error?.response?.data?.erreur || error?.response?.data?.message || error?.message || "Erreur lors du chargement des besoins.";
      setErrorMsg(apiMessage);
    }
  };

  const handleConcertation = (demande: DemandeCollecte) => {
    setConsultingDemandeId(null);
    setConcertingDemande(demande);
  };

  const handleTransmettre = async (id: number) => {
    try {
      const updatedResponse = await demandeCollecteService.transmettre(id);
      // The API returns a TransmissionDemandeResponse. We just update the status locally for simplicity.
      setDemandes((prev) => prev.map((d) => (d.id === id ? { ...d, statut: "TRANSMISE" } : d)));
      setErrorMsg("");
      setSuccessMsg(`Demande transmise avec succès — ${updatedResponse.nombreAffectationsPrevues} affectations prévues générées.`);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (error: any) {
      const apiMessage = error?.response?.data?.erreur || error?.response?.data?.message || error?.message || "Erreur lors de la transmission.";
      setErrorMsg(apiMessage);
    }
  };

  const handleDemandeValidee = (demandeUpdated: DemandeCollecte) => {
    setDemandes((prev) => prev.map((d) => (d.id === demandeUpdated.id ? demandeUpdated : d)));
    setConcertingDemande(null); // Return to list view
  };
  return (
    <div className="collecte-page">
      <div className="collecte-page-header">
        <h1>Collecte des besoins</h1>
        <p>Créez une demande et informez automatiquement les enseignants du département.</p>
      </div>

      <div className="collecte-page-grid">
        <DemandeCollecteForm onCreated={handleCreated} />
        <div className="flex flex-col gap-4">
          {errorMsg && <div className="collecte-alert collecte-alert-error">{errorMsg}</div>}
          {successMsg && <div className="collecte-alert collecte-alert-success">{successMsg}</div>}
          {loading ? (
            <div className="collecte-card">Chargement des demandes...</div>
          ) : (
            <DemandeCollecteList
              demandes={demandes}
              onOpen={handleOpen}
              onClose={handleClose}
              onConsult={handleConsult}
              onConcertation={handleConcertation}
              onTransmettre={handleTransmettre}
            />
          )}

          {consultingDemandeId && selectedDemandeTitre && (
            <BesoinsDemandeList besoins={besoins} demandeTitre={selectedDemandeTitre} />
          )}

          {concertingDemande && (
            <ConcertationPanel demande={concertingDemande} onDemandeValidee={handleDemandeValidee} />
          )}
        </div>
      </div>
    </div>
  );
}
