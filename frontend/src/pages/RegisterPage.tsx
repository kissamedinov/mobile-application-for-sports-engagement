import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "../api/auth";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register(email, password);
      const res = await login(email, password);
      localStorage.setItem("token", res.access_token);
      navigate("/"); // ✅ главный маршрут
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-sm border border-zinc-800 rounded p-6">
        <h1 className="text-xl font-semibold mb-4 text-emerald-400">Register</h1>

        {error && <div className="text-xs text-red-400 mb-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs block mb-1">Email</label>
            <input
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs block mb-1">Password</label>
            <input
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-sm"
          >
            Register
          </button>
        </form>

        <div className="text-xs text-zinc-400 mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
