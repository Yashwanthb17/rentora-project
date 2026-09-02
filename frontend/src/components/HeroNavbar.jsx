import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function HeroNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, role, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardPath = role === "OWNER" ? "/owner" : role === "ADMIN" ? "/admin" : "/tenant";
  const linkColor = scrolled ? "#163B3A" : "#FFFFFF";

  return (
    <div
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(250,249,246,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(22,59,58,0.08)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-14 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Home size={16} style={{ color: linkColor }} />
          <span
            className="text-lg tracking-wide font-semibold"
            style={{ color: linkColor, textShadow: scrolled ? "none" : "0 1px 8px rgba(9,30,30,0.25)" }}
          >
            RENTORA
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-sm font-medium" style={{ color: linkColor }}>
          <Link to="/properties" className="opacity-90 hover:opacity-100 transition-opacity" style={{ textShadow: scrolled ? "none" : "0 1px 8px rgba(9,30,30,0.25)" }}>
            Properties
          </Link>
          <a href="#for-owners" className="opacity-90 hover:opacity-100 transition-opacity" style={{ textShadow: scrolled ? "none" : "0 1px 8px rgba(9,30,30,0.25)" }}>
            For Owners
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate(dashboardPath)} className="text-sm font-medium px-4 py-2" style={{ color: linkColor }}>
                Dashboard
              </button>
              <button
                onClick={signOut}
                className="text-sm font-medium px-5 py-2.5 rounded-lg"
                style={{ backgroundColor: scrolled ? "#0D5C58" : "rgba(255,255,255,0.16)", color: "#fff", border: scrolled ? "none" : "1px solid rgba(255,255,255,0.5)" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-lg" style={{ color: linkColor, border: `1px solid ${scrolled ? "#E5E1D6" : "rgba(255,255,255,0.5)"}` }}>
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-5 py-2.5 rounded-lg"
                style={{ backgroundColor: scrolled ? "#0D5C58" : "rgba(255,255,255,0.16)", color: "#fff", border: scrolled ? "none" : "1px solid rgba(255,255,255,0.5)", backdropFilter: scrolled ? "none" : "blur(6px)" }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" style={{ color: linkColor }} onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4" style={{ backgroundColor: "#FAF9F6" }}>
          <Link to="/properties" className="text-sm font-medium" style={{ color: "#163B3A" }}>Properties</Link>
          <a href="#for-owners" className="text-sm font-medium" style={{ color: "#163B3A" }}>For Owners</a>
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate(dashboardPath)} className="text-sm font-medium text-left" style={{ color: "#163B3A" }}>Dashboard</button>
              <button onClick={signOut} className="text-sm font-medium text-left text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium" style={{ color: "#163B3A" }}>Login</Link>
              <Link to="/register" className="text-sm font-medium rounded-lg px-5 py-2.5 w-fit text-white" style={{ backgroundColor: "#0D5C58" }}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
