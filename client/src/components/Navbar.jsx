import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import React, { useState } from "react";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `block md:inline-block px-4 py-2 rounded-xl transition-colors duration-300 font-medium ${
      isActive(path)
        ? "bg-amber-400 text-gray-900"
        : "text-gray-200 hover:bg-amber-400/20 hover:text-white"
    }`;

  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="bg-[#1f1f28] shadow-lg px-4 py-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-bold text-amber-400 tracking-wide">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          MERN Inventory Management System (AR)
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkClass("/")}>Dashboard</Link>
          <Link to="/sales" className={linkClass("/sales")}>Sales</Link>
          <Link to="/sales/history" className={linkClass("/sales/history")}>History</Link>
          <Link to="/restock" className={linkClass("/restock")}>Restock</Link>
          {location.pathname === "/" && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKey}
              placeholder="Search items..."
              className="ml-4 px-3 py-1 rounded-md text-sm bg-[#2a2a3b] text-white border border-gray-600 placeholder-gray-400"
            />
          )}
        </div>
        <button
          className="md:hidden text-gray-200 hover:text-amber-400 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
