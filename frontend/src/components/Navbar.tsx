import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return null;

  return (
    <nav className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur border-b border-zinc-800">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left side */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-lg font-bold text-emerald-400 tracking-wide"
          >
            ⚽ Sports Match MVP
          </Link>

          {user && (
            <>
              <Link
                to="/"
                className="text-sm hover:text-emerald-300 transition"
              >
                Dashboard
              </Link>

              <Link
                to="/matches"
                className="text-sm hover:text-emerald-300 transition"
              >
                Matches
              </Link>

              <Link
                to="/profile"
                className="text-sm hover:text-emerald-300 transition"
              >
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <NotificationBell />

              <button
                onClick={handleLogout}
                className="text-xs px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
