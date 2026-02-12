import api from "./client";

export async function listNotifications() {
  const res = await api.get("/notifications");
  return res.data;
}

export async function markNotificationRead(id: number) {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
}