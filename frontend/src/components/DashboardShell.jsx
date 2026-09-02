import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function DashboardShell({ nav, children }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-canvas flex">
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100">
          <div className="h-8 w-8 rounded-lg bg-teal text-white flex items-center justify-center">
            <Home size={16} />
          </div>
          <span className="font-semibold text-darktext tracking-wide">RENTORA</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-sage text-teal" : "text-secondary hover:bg-slate-50 hover:text-darktext"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="h-8 w-8 rounded-full bg-darktext text-white text-xs flex items-center justify-center">
              {(user?.name || "?").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-darktext truncate">{user?.name || "..."}</p>
              <p className="text-xs text-secondary truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-secondary hover:bg-slate-50 hover:text-red-600"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}
