import { FormEvent, useEffect, useState } from "react";
import { createMatch, listMatches } from "../api/matches";
import MatchCard from "../components/MatchCard";

const MatchesPage = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [sportFilter, setSportFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [sportType, setSportType] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(10);

  const load = () => {
    listMatches({
      sport: sportFilter || undefined,
      location: locationFilter || undefined,
    }).then(setMatches);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!sportType || !dateTime || !location) return;
    await createMatch({
      sport_type: sportType,
      date_time: new Date(dateTime).toISOString(),
      location,
      max_players: maxPlayers,
    });
    setSportType("");
    setDateTime("");
    setLocation("");
    setMaxPlayers(10);
    load();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-sm font-semibold mb-2 text-emerald-300">Search</h2>
        <div className="space-y-2 mb-4">
          <input
            placeholder="Sport"
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
          />
          <input
            placeholder="Location"
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
          <button
            onClick={load}
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-xs"
          >
            Apply filters
          </button>
        </div>
        <h2 className="text-sm font-semibold mb-2 text-emerald-300">
          Available matches
        </h2>
        <div className="space-y-2">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
          {matches.length === 0 && (
            <div className="text-xs text-zinc-500">No matches found.</div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2 text-emerald-300">
          Create match
        </h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="text-xs block mb-1">Sport type</label>
            <input
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              value={sportType}
              onChange={(e) => setSportType(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs block mb-1">Date & time</label>
            <input
              type="datetime-local"
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs block mb-1">Location</label>
            <input
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs block mb-1">Max players</label>
            <input
              type="number"
              min={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              required
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-sm"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default MatchesPage;