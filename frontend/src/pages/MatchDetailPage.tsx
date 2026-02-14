import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { autoTeams, getMatch, joinMatch } from "../api/matches";
import ChatBox from "../components/ChatBox";
import Loader from "../components/Loader";
import { Match, User } from "../types";

const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [match, setMatch] = useState<Match | null>(null);
  const [teams, setTeams] = useState<{ team_a: User[]; team_b: User[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!id) return;
    getMatch(id).then(setMatch);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleJoin = async () => {
    if (!id) return;

    try {
      setError(null);
      await joinMatch(id);
      load();
    } catch {
      setError("Could not join match (maybe full or already joined).");
    }
  };

  const handleAutoTeams = async () => {
    if (!id) return;

    try {
      const res = await autoTeams(id);
      setTeams(res);
    } catch {
      setError("Could not generate teams.");
    }
  };

  if (!match) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">

      {/* Match Header */}
      <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900 space-y-3">
        <h1 className="text-2xl font-bold text-emerald-400">
          {match.sport_type}
        </h1>

        <div className="text-sm text-zinc-400">
          {new Date(match.date_time).toLocaleString()}
        </div>

        <div className="text-sm text-zinc-500">
          📍 {match.location}
        </div>

        <div className="text-xs text-zinc-500 mt-2">
          {match.current_players}/{match.max_players} players • {match.status}
        </div>

        <button
          onClick={handleJoin}
          className="mt-3 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-sm"
        >
          Join match
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Participants */}
      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide text-emerald-400">
          Participants
        </h2>

        <ul className="text-sm text-zinc-300 space-y-1">
          {match.participants?.map((p) => (
            <li key={p.id}>
              {p.full_name || p.email} ({p.skill_level || "n/a"})
            </li>
          ))}
        </ul>
      </div>

      {/* Teams */}
      <div>
        <button
          onClick={handleAutoTeams}
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-sm"
        >
          Auto-split into teams
        </button>

        {teams && (
          <div className="grid grid-cols-2 gap-6 mt-4 text-sm">
            <div>
              <div className="font-semibold mb-2 text-emerald-400">
                Team A
              </div>
              <ul className="space-y-1">
                {teams.team_a.map((p) => (
                  <li key={p.id}>
                    {p.full_name || p.email}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-semibold mb-2 text-emerald-400">
                Team B
              </div>
              <ul className="space-y-1">
                {teams.team_b.map((p) => (
                  <li key={p.id}>
                    {p.full_name || p.email}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {id && <ChatBox matchId={id} />}

    </div>
  );
};

export default MatchDetailPage;
