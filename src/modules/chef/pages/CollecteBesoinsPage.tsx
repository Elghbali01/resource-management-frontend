import { useEffect, useState } from "react";
import type { DemandeCollecte } from "../../../types/demandeCollecte";
import { demandeCollecteService } from "../services/demandeCollecteService";
import DemandeCollecteForm from "../components/DemandeCollecteForm";
import DemandeCollecteList from "../components/DemandeCollecteList";
import "./CollecteBesoinsPage.css";

export default function CollecteBesoinsPage() {
  const [demandes, setDemandes] = useState<DemandeCollecte[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="collecte-page">
      <div className="collecte-page-header">
        <h1>Collecte des besoins</h1>
        <p>Créez une demande et informez automatiquement les enseignants du département.</p>
      </div>

      <div className="collecte-page-grid">
        <DemandeCollecteForm onCreated={handleCreated} />
        {loading ? (
          <div className="collecte-card">Chargement des demandes...</div>
        ) : (
          <DemandeCollecteList demandes={demandes} />
        )}
      </div>
    </div>
  );
}
