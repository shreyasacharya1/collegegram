import { GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  if (!token) return null;

  return (
    <header className="sticky top-0 z-20 border-b bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between p-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
          <GraduationCap size={20} />
          Collegegram
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/">Feed</Link>
          <Link to="/ask-seniors">Ask Seniors</Link>
          <Link to={`/profile/${user?._id}`}>Profile</Link>
          <button
            className="text-red-600"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
