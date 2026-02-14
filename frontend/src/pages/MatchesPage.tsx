import { FormEvent, useEffect, useState } from "react";
import { createMatch, listMatches } from "../api/matches";
import MatchCard from "../components/MatchCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { Match } from "../types";
import { useToast } from "../context/ToastContext";

const MatchesPage = () => {
  const { showToast } = useToast();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const [sportFilter, setSportFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [sportType, setSportType] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(10);

  const load = () => {
    setLoading(true);

    listMatches({
      sport: sportFilter || undefined,
      location: locationFilter || undefined,
    })
      .then(setMatches)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    if (!sportType || !dateTime || !location) return;

    try {
      await createMatch({
        sport_type: sportType,
        date_time: new Date(dateTime).toISOString(),
        location,
        max_players: maxPlayers,
      });

      showToast("Match created successfully", "success");

      setSportType("");
      setDateTime("");
      setLocation("");
      setMaxPlayers(10);

      load();
    } catch {
      showToast("Failed to create match", "error");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10">

      {/* LEFT: Search + Matches */}
      <div className="space-y-8">

        {/* Search Card */}
        <div className="rounded-2xl p-6 bg-zinc-900/70 backdrop-blur border border-zinc-800">
          <h2 className="text-lg font-semibold text-emerald-400 mb-4">
            Search Matches
          </h2>

          <div className="space-y-3">
            <input
              placeholder="Sport"
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />

            <input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={load}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
            Available Matches
          </h2>

          {matches.length === 0 ? (
            <EmptyState
              title="No matches found"
              subtitle="Try changing filters or create a new match"
            />
          ) : (
            matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Create Match */}
      <div className="rounded-2xl p-8 bg-zinc-900/70 backdrop-blur border border-zinc-800 shadow-xl shadow-emerald-900/10">
        <h2 className="text-lg font-semibold text-emerald-400 mb-6">
          Create Match
        </h2>

        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="text-xs block mb-1 text-zinc-400">
              Sport type
            </label>
            <input
              value={sportType}
              onChange={(e) => setSportType(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs block mb-1 text-zinc-400">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs block mb-1 text-zinc-400">
              Location
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs block mb-1 text-zinc-400">
              Max players
            </label>
            <input
              type="number"
              min={2}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-sm font-medium"
          >
            Create Match
          </button>
        </form>
      </div>

    </div>
  );
};

export default MatchesPage;
