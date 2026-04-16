export interface AppNotification {
  id: number;
  message: string;
  dateCreation: string;
  lu: boolean;
  typeNotification: string;
  demandeId?: number;
  referenceId?: number;
}

export interface NotificationCountResponse {
  nonLues: number;
}
