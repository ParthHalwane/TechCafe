// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

export default function Header() {
  const linkClasses =
    "hover:text-pink-400 transition duration-300 text-white";

  const activeLink = "text-pink-400 font-semibold";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-[#2d2a26] shadow-xl">
      <Link to="/" className="text-3xl font-bold text-pink-300 hover:scale-105 transition">
        TechCafé
      </Link>

      <div className="space-x-6 hidden md:flex">
        <NavLink to="/rooms" className={({ isActive }) => `${linkClasses} ${isActive ? activeLink : ""}`}>Rooms</NavLink>
        <NavLink to="/hackarena" className={({ isActive }) => `${linkClasses} ${isActive ? activeLink : ""}`}>HackArena</NavLink>
        <NavLink to="/pods" className={({ isActive }) => `${linkClasses} ${isActive ? activeLink : ""}`}>Pods</NavLink>
        <NavLink to="/devs" className={({ isActive }) => `${linkClasses} ${isActive ? activeLink : ""}`}>Devs</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `${linkClasses} ${isActive ? activeLink : ""}`}>Contact</NavLink>
      </div>

      <Link to="/signin">
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-400 transition-all">
          <FaGithub className="text-xl" />
          Sign in with GitHub
        </button>
      </Link>
    </nav>
  );
}
