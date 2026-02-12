import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { listMatches } from "../api/matches";
import MatchCard from "../components/MatchCard";

const DashboardPage = () => {
  const [user, setUser] = useState<any | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCurrentUser(), listMatches()])
      .then(([userRes, matchesRes]) => {
        setUser(userRes);
        setMatches(matchesRes);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-zinc-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
        {user && (
          <div className="text-xs text-zinc-400">
            {user.full_name || user.email} •{" "}
            {user.sport_interest || "No sport set"}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2 text-emerald-300">
          Upcoming matches
        </h2>

        <div className="space-y-2">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}

          {matches.length === 0 && (
            <div className="text-xs text-zinc-500">No matches yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
