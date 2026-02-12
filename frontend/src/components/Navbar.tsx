import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-emerald-400">
            Sports Match MVP
          </span>
          <Link to="/dashboard" className="hover:text-emerald-300 text-sm">
            Dashboard
          </Link>
          <Link to="/matches" className="hover:text-emerald-300 text-sm">
            Matches
          </Link>
          <Link to="/profile" className="hover:text-emerald-300 text-sm">
            Profile
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationBell />
          <button
            onClick={logout}
            className="text-xs px-3 py-1 rounded bg-red-600 hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;