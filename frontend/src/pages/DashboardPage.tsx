import { useEffect, useState } from "react";
import { listMatches } from "../api/matches";
import MatchCard from "../components/MatchCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { Match } from "../types";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMatches()
      .then(setMatches)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (authLoading || loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Welcome back
        </h1>

        {user && (
          <div className="text-sm text-zinc-400">
            {user.full_name || user.email}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3 text-emerald-400 uppercase tracking-wide">
          Upcoming matches
        </h2>

        <div className="space-y-4">
          {matches.length === 0 ? (
            <EmptyState
              title="No matches yet"
              subtitle="Create or join a match to get started"
            />
          ) : (
            matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
