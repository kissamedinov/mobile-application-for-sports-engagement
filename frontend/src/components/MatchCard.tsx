import { Link } from "react-router-dom";
import { Match } from "../types";

type Props = {
  match: Match;
};

const MatchCard = ({ match }: Props) => {
  return (
    <div
      className="
        group
        rounded-2xl
        p-6
        bg-zinc-900/70
        backdrop-blur
        border border-zinc-800
        hover:border-emerald-500
        transition-all duration-300
        hover:shadow-xl
        hover:shadow-emerald-900/20
      "
    >
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="text-emerald-400 font-semibold text-lg">
            {match.sport_type}
          </div>

          <div className="text-sm text-zinc-400">
            {new Date(match.date_time).toLocaleString()}
          </div>

          <div className="text-sm text-zinc-500">
            📍 {match.location}
          </div>

          <div className="text-xs text-zinc-500 mt-2">
            {match.current_players}/{match.max_players} players • {match.status}
          </div>
        </div>

        <Link
          to={`/matches/${match.id}`}
          className="px-4 py-2 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 transition"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default MatchCard;
