interface Props {
  count: number;
  onClick: () => void;
}

export default function NotificationBell({ count, onClick }: Props) {
  return (
    <button className="notif-bell-btn" onClick={onClick} type="button">
      <span className="notif-bell-icon">🔔</span>
      {count > 0 && <span className="notif-bell-badge">{count}</span>}
    </button>
  );
}
