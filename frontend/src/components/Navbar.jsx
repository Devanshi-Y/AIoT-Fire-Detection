import { Link, useLocation } from "react-router-dom";
import { Flame } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();

  const navLink = (path, name) => (
    <Link
      to={path}
      className={`relative px-4 py-2 font-medium transition ${
        pathname === path
          ? "text-orange-600"
          : "text-gray-600 hover:text-orange-500"
      }`}
    >
      {name}

      {/* Active underline */}
      {pathname === path && (
        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-orange-500 rounded-full"></span>
      )}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <div className="flex items-center gap-2 text-orange-600 font-semibold text-lg">
          <Flame />
          FireSense
        </div>

        {/* NAV LINKS */}
        <div className="flex gap-8">
          {navLink("/", "Home")}
          {navLink("/dashboard", "Dashboard")}
          {navLink("/visuals", "Visuals")}
        </div>

      </div>
    </nav>
  );
}