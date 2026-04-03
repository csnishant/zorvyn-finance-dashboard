// src/components/Layout/Navbar.jsx
import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { User, ShieldCheck, Eye } from "lucide-react"; // Icons ke liye

const Navbar = () => {
  const { role, setRole } = useContext(AppContext);

  return (
    <nav className="h-16 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
      <div className="text-sm text-slate-400 font-medium">
        Finance / <span className="text-white font-semibold">Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Switcher - Essential for Assignment Point #3 */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setRole("admin")}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              role === "admin"
                ? "bg-fuchsia-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}>
            <ShieldCheck size={14} /> Admin
          </button>
          <button
            onClick={() => setRole("viewer")}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              role === "viewer"
                ? "bg-fuchsia-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}>
            <Eye size={14} /> Viewer
          </button>
        </div>

        {/* Profile Circle */}
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-fuchsia-600 to-violet-600 flex items-center justify-center border border-slate-700 shadow-lg shadow-fuchsia-500/20">
          <User size={18} className="text-white" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
