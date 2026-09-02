import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { decodeJwt } from "../api/jwt";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      const token = localStorage.getItem("rentora_token");
      const role = decodeJwt(token)?.role;
      if (role === "OWNER") navigate("/owner");
      else if (role === "ADMIN") navigate("/admin");
      else navigate("/tenant");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="h-9 w-9 rounded-lg bg-teal text-white flex items-center justify-center">
            <Home size={16} />
          </div>
          <span className="text-lg font-semibold text-darktext tracking-wide">RENTORA</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-semibold text-darktext text-center">Welcome back</h1>
          <p className="text-sm text-secondary text-center mt-1">Log in to continue to Rentora.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-secondary">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-secondary text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-teal font-medium">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
