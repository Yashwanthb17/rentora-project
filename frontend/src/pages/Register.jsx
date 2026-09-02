import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "", phone: "", role: "TENANT",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await signUp(form);
      navigate(form.role === "OWNER" ? "/owner" : "/tenant");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="h-9 w-9 rounded-lg bg-teal text-white flex items-center justify-center">
            <Home size={16} />
          </div>
          <span className="text-lg font-semibold text-darktext tracking-wide">RENTORA</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-semibold text-darktext text-center">Create your account</h1>
          <p className="text-sm text-secondary text-center mt-1">One account, for renting or managing.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              {["TENANT", "OWNER"].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => update("role", r)}
                  className={`flex-1 text-sm font-medium rounded-lg py-2 border transition-colors ${
                    form.role === r
                      ? "bg-sage border-teal text-teal"
                      : "border-slate-200 text-secondary"
                  }`}
                >
                  {r === "TENANT" ? "I'm renting" : "I own property"}
                </button>
              ))}
            </div>

            {[
              { label: "Full name", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Phone", key: "phone", type: "tel" },
              { label: "Password", key: "password", type: "password" },
              { label: "Confirm password", key: "confirm", type: "password" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-secondary">{f.label}</label>
                <input
                  type={f.type}
                  required
                  value={form[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-secondary text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-teal font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
