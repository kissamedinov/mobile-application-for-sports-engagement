import api from "./client";

export async function login(email: string, password: string) {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);
  const res = await api.post("/auth/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data as { access_token: string; token_type: string };
}

export async function register(email: string, password: string) {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data;
}