import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, role, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardPath = role === "OWNER" ? "/owner" : role === "ADMIN" ? "/admin" : "/tenant";

  return (
    <div
      className="sticky top-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(250,249,246,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(22,59,58,0.08)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-teal text-white flex items-center justify-center">
            <Home size={16} />
          </div>
          <span className="font-semibold text-darktext tracking-wide">RENTORA</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-darktext">
          <Link to="/properties" className="opacity-80 hover:opacity-100">Properties</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate(dashboardPath)} className="text-sm font-medium text-darktext px-4 py-2">
                Dashboard
              </button>
              <button onClick={signOut} className="text-sm font-medium bg-teal text-white rounded-full px-5 py-2.5">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-darktext px-4 py-2">Login</Link>
              <Link to="/register" className="text-sm font-medium bg-teal text-white rounded-full px-5 py-2.5">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-darktext" onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-3 bg-canvas">
          <Link to="/properties" className="text-sm font-medium text-darktext">Properties</Link>
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate(dashboardPath)} className="text-sm font-medium text-darktext text-left">Dashboard</button>
              <button onClick={signOut} className="text-sm font-medium text-red-600 text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-darktext">Login</Link>
              <Link to="/register" className="text-sm font-medium bg-teal text-white rounded-full px-4 py-2 w-fit">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
