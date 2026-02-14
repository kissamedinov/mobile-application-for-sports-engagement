import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginRequest(email, password);

      if (!res?.access_token) {
        throw new Error("No access token returned");
      }

      console.log("Token received:", res.access_token);

      // 🔥 ВАЖНО — ждём пока user загрузится
      await login(res.access_token);

      console.log("User set in context");

      navigate("/dashboard", { replace: true });

    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="card w-full max-w-sm">
        <h1 className="page-title">Login</h1>

        {error && (
          <div className="text-xs text-red-400 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="text-xs text-zinc-400 mt-4">
          No account?{" "}
          <Link
            to="/register"
            className="text-emerald-400 hover:text-emerald-300 transition"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}
