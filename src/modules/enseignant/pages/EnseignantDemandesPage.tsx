import { useEffect, useState } from "react";
import type { DemandeCollecte } from "../../../types/demandeCollecte";
import type { AppNotification } from "../../../types/notification";
import { notificationService } from "../services/notificationService";
import { enseignantDemandeService } from "../services/enseignantDemandeService";
import NotificationPanel from "../components/NotificationPanel";
import OpenDemandesList from "../components/OpenDemandesList";
import "./EnseignantDemandesPage.css";

export default function EnseignantDemandesPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [demandes, setDemandes] = useState<DemandeCollecte[]>([]);
  const [selectedDemandeId, setSelectedDemandeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notifData, demandesData] = await Promise.all([
        notificationService.getAll(),
        enseignantDemandeService.getOpenDemandes(),
      ]);

      setNotifications(notifData);
      setDemandes(demandesData);
    } catch (error) {
      console.error("Erreur chargement espace enseignant :", error);
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
    } catch (error) {
      console.error("Erreur marquage notification :", error);
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

      setTimeout(() => {
        const el = document.getElementById(`demande-${demandeId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
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

          <OpenDemandesList
            demandes={demandes}
            selectedDemandeId={selectedDemandeId}
          />
        </div>
      )}
    </div>
  );
}
