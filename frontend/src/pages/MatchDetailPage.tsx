import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { autoTeams, getMatch, joinMatch } from "../api/matches";
import ChatBox from "../components/ChatBox";

const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<any | null>(null);
  const [teams, setTeams] = useState<{ team_a: any[]; team_b: any[] } | null>(null);
  const [error, setError] = useState("");

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
      setError("");
      await joinMatch(id);
      load();
    } catch (e: any) {
      setError("Could not join match (maybe full or already joined).");
    }
  };

  const handleAutoTeams = async () => {
    if (!id) return;
    try {
      const res = await autoTeams(id);
      setTeams(res);
    } catch (e: any) {
      setError("Could not generate teams.");
    }
  };

  if (!match) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-emerald-300">
            {match.sport_type}
          </h1>
          <div className="text-xs text-zinc-400">
            {new Date(match.date_time).toLocaleString()} • {match.location}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {match.current_players}/{match.max_players} players • {match.status}
          </div>
        </div>
        <button
          onClick={handleJoin}
          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-xs"
        >
          Join match
        </button>
      </div>

      {error && <div className="text-xs text-red-400">{error}</div>}

      <div>
        <h2 className="text-sm font-semibold mb-1">Participants</h2>
        <ul className="text-xs text-zinc-300 space-y-1">
          {match.participants?.map((p: any) => (
            <li key={p.id}>
              {p.full_name || p.email} ({p.skill_level || "n/a"})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button
          onClick={handleAutoTeams}
          className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs"
        >
          Auto-split into teams
        </button>
        {teams && (
          <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
            <div>
              <div className="font-semibold mb-1 text-emerald-300">Team A</div>
              <ul className="space-y-1">
                {teams.team_a.map((p) => (
                  <li key={p.id}>{p.full_name || p.email}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-1 text-emerald-300">Team B</div>
              <ul className="space-y-1">
                {teams.team_b.map((p) => (
                  <li key={p.id}>{p.full_name || p.email}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <ChatBox matchId={id!} />
    </div>
  );
};

export default MatchDetailPage;