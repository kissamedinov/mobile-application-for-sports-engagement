import { Link } from "react-router-dom";

type Props = {
  match: any;
};

const MatchCard = ({ match }: Props) => {
  return (
    <div className="border border-zinc-800 rounded p-4 flex justify-between items-center">
      <div>
        <div className="font-semibold text-emerald-300">{match.sport_type}</div>
        <div className="text-xs text-zinc-400">
          {new Date(match.date_time).toLocaleString()} • {match.location}
        </div>
        <div className="text-xs text-zinc-500 mt-1">
          {match.current_players}/{match.max_players} players • {match.status}
        </div>
      </div>
      <Link
        to={`/matches/${match.id}`}
        className="px-3 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500"
      >
        View
      </Link>
    </div>
  );
};

export default MatchCard;