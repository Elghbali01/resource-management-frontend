import type { AppNotification } from "../../../types/notification";
import NotificationItem from "./NotificationItem";

interface Props {
  notifications: AppNotification[];
  onMarkAsRead: (id: number) => void;
  onOpenDemande: (demandeId?: number, notificationId?: number, isRead?: boolean) => void;
}

export default function NotificationPanel({
  notifications,
  onMarkAsRead,
  onOpenDemande,
}: Props) {
  return (
    <div className="enseignant-card">
      <div className="enseignant-card-header">
        <h2>Mes notifications</h2>
        <p>Consultez les alertes relatives aux nouvelles demandes de collecte.</p>
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="empty-state">Aucune notification disponible.</div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onOpenDemande={onOpenDemande}
            />
          ))
        )}
      </div>
    </div>
  );
}
