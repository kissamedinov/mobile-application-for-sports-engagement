import { useEffect, useState } from "react";
import { listNotifications, markNotificationRead } from "../api/notifications";
import { Notification } from "../types";

const NotificationBell = () => {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const load = () => {
    listNotifications().then(setItems);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  const unreadCount = items.filter((n) => !n.read_at).length;

  const onMarkRead = async (id: number) => {
    await markNotificationRead(id);
    load();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative px-2 py-1 rounded hover:bg-zinc-800"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded shadow-lg max-h-80 overflow-y-auto z-20">
          {items.length === 0 && (
            <div className="px-3 py-2 text-xs text-zinc-400">
              No notifications
            </div>
          )}

          {items.map((n) => (
            <div
              key={n.id}
              className={`px-3 py-2 text-xs border-b border-zinc-800 ${
                n.read_at ? "text-zinc-500" : "text-white"
              }`}
            >
              <div className="font-semibold">{n.title}</div>
              <div className="text-zinc-400">{n.message}</div>

              {!n.read_at && (
                <button
                  onClick={() => onMarkRead(n.id)}
                  className="mt-1 text-emerald-400 hover:text-emerald-300"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
