import { useCallback, useEffect, useState } from "react";
import { notificationService } from "../modules/enseignant/services/notificationService";

export function useNotificationPolling(enabled = true, intervalMs = 15000) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadCount = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      const data = await notificationService.getUnreadCount();
      setCount(data.nonLues ?? 0);
    } catch (error) {
      console.error("Erreur compteur notifications :", error);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    loadCount();
    const timer = setInterval(loadCount, intervalMs);

    return () => clearInterval(timer);
  }, [enabled, intervalMs, loadCount]);

  return {
    count,
    loading,
    refreshCount: loadCount,
    setCount,
  };
}
