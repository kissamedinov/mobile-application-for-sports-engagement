import api from "./client";

export async function listMatches(params?: {
  sport?: string;
  location?: string;
}) {
  const res = await api.get("/matches", { params });
  return res.data;
}

export async function createMatch(payload: {
  sport_type: string;
  date_time: string;
  location: string;
  max_players: number;
}) {
  const res = await api.post("/matches", payload);
  return res.data;
}

export async function getMatch(id: string | number) {
  const res = await api.get(`/matches/${id}`);
  return res.data;
}

export async function joinMatch(id: string | number) {
  const res = await api.post(`/matches/${id}/join`);
  return res.data;
}

export async function autoTeams(id: string | number) {
  const res = await api.post(`/matches/${id}/auto-teams`);
  return res.data as { team_a: any[]; team_b: any[] };
}

export async function getChat(id: string | number) {
  const res = await api.get(`/matches/${id}/chat`);
  return res.data;
}

export async function sendChat(id: string | number, message: string) {
  const res = await api.post(`/matches/${id}/chat`, { message });
  return res.data;
}