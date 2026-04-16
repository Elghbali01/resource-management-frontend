import type { AppNotification } from "../../../types/notification";

interface Props {
  notification: AppNotification;
  onMarkAsRead: (id: number) => void;
  onOpenDemande: (demandeId?: number, notificationId?: number, isRead?: boolean) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onOpenDemande,
}: Props) {
  return (
    <div className={`notif-item ${notification.lu ? "notif-read" : "notif-unread"}`}>
      <div className="notif-item-content" onClick={() => onOpenDemande(notification.demandeId, notification.id, notification.lu)}>
        <div className="notif-item-top">
          <span className="notif-type">{notification.typeNotification}</span>
          {!notification.lu && <span className="notif-dot" />}
        </div>

        <p className="notif-message">{notification.message}</p>
        <small className="notif-date">
          {new Date(notification.dateCreation).toLocaleString("fr-FR")}
        </small>
      </div>

      {!notification.lu && (
        <button
          className="notif-read-btn"
          onClick={() => onMarkAsRead(notification.id)}
          type="button"
        >
          Marquer comme lue
        </button>
      )}
    </div>
  );
}
