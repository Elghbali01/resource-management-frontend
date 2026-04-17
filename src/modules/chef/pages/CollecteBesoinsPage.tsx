import { useEffect, useState } from "react";
import type { DemandeCollecte } from "../../../types/demandeCollecte";
import type { Besoin } from "../../../types/besoin";
import { demandeCollecteService } from "../services/demandeCollecteService";
import { besoinChefService } from "../services/besoinChefService";
import DemandeCollecteForm from "../components/DemandeCollecteForm";
import DemandeCollecteList from "../components/DemandeCollecteList";
import BesoinsDemandeList from "../components/BesoinsDemandeList";
import "./CollecteBesoinsPage.css";

export default function CollecteBesoinsPage() {
  const [demandes, setDemandes] = useState<DemandeCollecte[]>([]);
  const [loading, setLoading] = useState(true);
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [selectedDemandeTitre, setSelectedDemandeTitre] = useState<string | null>(null);
  const [consultingDemandeId, setConsultingDemandeId] = useState<number | null>(null);
  
  const [errorMsg, setErrorMsg] = useState("");

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
      setErrorMsg(error?.response?.data?.message || "Erreur lors de l'ouverture de la demande.");
    }
  };

  const handleClose = async (id: number) => {
    try {
      const updated = await demandeCollecteService.close(id);
      setDemandes((prev) => prev.map((d) => (d.id === id ? updated : d)));
      setErrorMsg("");
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Erreur lors de la fermeture de la demande.");
    }
  };

  const handleConsult = async (id: number) => {
    try {
      const demande = demandes.find((d) => d.id === id);
      if (demande) setSelectedDemandeTitre(demande.titre);
      
      const loadedBesoins = await besoinChefService.getBesoinsByDemande(id);
      setBesoins(loadedBesoins);
      setConsultingDemandeId(id);
      setErrorMsg("");
    } catch (error: any) {
      setErrorMsg("Erreur lors du chargement des besoins.");
    }
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
          {loading ? (
            <div className="collecte-card">Chargement des demandes...</div>
          ) : (
            <DemandeCollecteList
              demandes={demandes}
              onOpen={handleOpen}
              onClose={handleClose}
              onConsult={handleConsult}
            />
          )}

          {consultingDemandeId && selectedDemandeTitre && (
            <BesoinsDemandeList besoins={besoins} demandeTitre={selectedDemandeTitre} />
          )}
        </div>
      </div>
    </div>
  );
}
