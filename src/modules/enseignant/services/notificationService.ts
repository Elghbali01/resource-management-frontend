import api from "../../../services/api";
import type {
  AppNotification,
  NotificationCountResponse,
} from "../../../types/notification";

const BASE = "/enseignant/notifications";

export const notificationService = {
  getAll: (): Promise<AppNotification[]> =>
    api.get(BASE).then((r) => r.data),

  getUnreadCount: (): Promise<NotificationCountResponse> =>
    api.get(`${BASE}/non-lues`).then((r) => r.data),

  markAsRead: (id: number): Promise<AppNotification> =>
    api.patch(`${BASE}/${id}/lire`).then((r) => r.data),
};
