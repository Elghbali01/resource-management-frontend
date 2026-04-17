import { useEffect, useState } from "react";
import type { DemandeCollecte } from "../../../types/demandeCollecte";
import type { AppNotification } from "../../../types/notification";
import { notificationService } from "../services/notificationService";
import { enseignantDemandeService } from "../services/enseignantDemandeService";
import { besoinService } from "../services/besoinService";
import type { Besoin } from "../../../types/besoin";
import NotificationPanel from "../components/NotificationPanel";
import OpenDemandesList from "../components/OpenDemandesList";
import BesoinForm from "../components/BesoinForm";
import BesoinList from "../components/BesoinList";
import "./EnseignantDemandesPage.css";

export default function EnseignantDemandesPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [demandes, setDemandes] = useState<DemandeCollecte[]>([]);
  const [selectedDemandeId, setSelectedDemandeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [besoins, setBesoins] = useState<Besoin[]>([]);
  const [besoinToEdit, setBesoinToEdit] = useState<Besoin | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notifData, demandesData] = await Promise.all([
        notificationService.getAll(),
        enseignantDemandeService.getOpenDemandes(),
      ]);

      setNotifications(notifData);
      setDemandes(demandesData);
    } catch (error: any) {
      console.error("Erreur chargement espace enseignant :", error);
      const apiMessage = error?.response?.data?.erreur || error?.response?.data?.message || "Erreur de chargement";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      const updated = await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? updated : n))
      );
    } catch (error: any) {
      console.error("Erreur marquage notification :", error);
      const apiMessage = error?.response?.data?.erreur || error?.response?.data?.message || "Erreur marquage";
    }
  };

  const handleOpenDemande = async (
    demandeId?: number,
    notificationId?: number,
    isRead?: boolean
  ) => {
    if (notificationId && !isRead) {
      await handleMarkAsRead(notificationId);
    }

    if (demandeId) {
      setSelectedDemandeId(demandeId);
      loadBesoins(demandeId);

      setTimeout(() => {
        const el = document.getElementById(`demande-${demandeId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  const loadBesoins = async (demId: number) => {
    try {
      const data = await besoinService.getByDemande(demId);
      setBesoins(data);
    } catch (error: any) {
      console.error("Erreur chargement des besoins:", error);
      const apiMessage = error?.response?.data?.erreur || error?.response?.data?.message || "Erreur lors du chargement des besoins";
    }
  };

  const handleSelectDemande = (id: number) => {
    setSelectedDemandeId(id);
    loadBesoins(id);
    setBesoinToEdit(null);
  };

  const handleBesoinSubmitted = (nouveauBesoin: Besoin) => {
    setBesoins((prev) => {
      const exists = prev.find((b) => b.id === nouveauBesoin.id);
      if (exists) {
        return prev.map((b) => (b.id === nouveauBesoin.id ? nouveauBesoin : b));
      }
      return [...prev, nouveauBesoin];
    });
    setBesoinToEdit(null);
  };

  const handleDeleteBesoin = async (id: number) => {
    try {
      await besoinService.delete(id);
      setBesoins((prev) => prev.filter((b) => b.id !== id));
    } catch (error: any) {
      console.error("Erreur suppression:", error);
      const apiMessage = error?.response?.data?.erreur || error?.response?.data?.message || "Erreur suppression";
      alert(apiMessage);
    }
  };

  return (
    <div className="enseignant-page">
      <div className="enseignant-page-header">
        <h1>Demandes et notifications</h1>
        <p>Suivez les collectes ouvertes et les alertes de votre département.</p>
      </div>

      {loading ? (
        <div className="enseignant-card">Chargement...</div>
      ) : (
        <div className="enseignant-grid">
          <NotificationPanel
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onOpenDemande={handleOpenDemande}
          />

          <div className="flex flex-col gap-6">
            <OpenDemandesList
              demandes={demandes}
              selectedDemandeId={selectedDemandeId}
              onSelectDemande={handleSelectDemande}
            />
            {selectedDemandeId && (
              <div className="enseignant-card p-6 bg-white rounded-lg shadow-sm">
                <BesoinForm
                  demandeId={selectedDemandeId}
                  onSubmitted={handleBesoinSubmitted}
                  besoinToEdit={besoinToEdit}
                  onCanceledEdit={() => setBesoinToEdit(null)}
                />
                <BesoinList
                  besoins={besoins}
                  onEdit={(b) => setBesoinToEdit(b)}
                  onDelete={handleDeleteBesoin}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
