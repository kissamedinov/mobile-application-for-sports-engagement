import api from "./client";

export async function updateProfile(payload: {
  full_name?: string;
  sport_interest?: string;
  skill_level?: string;
  location?: string;
}) {
  const res = await api.patch("/users/me", payload);
  return res.data;
}