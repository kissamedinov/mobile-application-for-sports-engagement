import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);

      // 🔐 сохраняем токен
      localStorage.setItem("token", res.access_token);

      // ➜ на дашборд
      navigate("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Login failed. Check email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: 16 }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
  },
  form: {
    background: "#fff",
    padding: 32,
    borderRadius: 8,
    width: 320,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  input: {
    padding: 10,
    fontSize: 14,
  },
  button: {
    padding: 10,
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    background: "#ffe0e0",
    color: "#900",
    padding: 8,
    borderRadius: 4,
    fontSize: 14,
  },
};
