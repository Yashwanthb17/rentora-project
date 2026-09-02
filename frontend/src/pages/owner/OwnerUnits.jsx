import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllProperties } from "../../api/properties";
import { getAllUnits, createUnit } from "../../api/units";
import { Card, Badge, LoadingState, ErrorState, EmptyState, statusTone } from "../../components/ui";
import { Layers, Plus } from "lucide-react";

const UNIT_STATUSES = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"];

export default function OwnerUnits() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    propertyId: "", unitNumber: "", monthlyRent: "", securityDeposit: "", status: "AVAILABLE",
  });

  function load() {
    Promise.all([getAllProperties(), getAllUnits()])
      .then(([allProperties, allUnits]) => {
        const mine = allProperties.filter((p) => p.ownerId === user.id);
        setProperties(mine);
        const myIds = new Set(mine.map((p) => p.id));
        setUnits(allUnits.filter((u) => myIds.has(u.propertyId)));
      })
      .catch(() => setError("Couldn't load your units."));
  }

  useEffect(load, [user.id]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.propertyId) return;
    setSubmitting(true);
    try {
      await createUnit(form.propertyId, {
        unitNumber: form.unitNumber,
        monthlyRent: Number(form.monthlyRent),
        securityDeposit: Number(form.securityDeposit),
        status: form.status,
        propertyId: Number(form.propertyId),
      });
      setShowForm(false);
      setForm({ propertyId: "", unitNumber: "", monthlyRent: "", securityDeposit: "", status: "AVAILABLE" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create that unit.");
    } finally {
      setSubmitting(false);
    }
  }

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (units === null) return <LoadingState />;

  const propertyName = (id) => properties.find((p) => p.id === id)?.title || `Property #${id}`;

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-darktext">Units</h1>
          <p className="text-sm text-secondary mt-1">Manage individual units across your properties.</p>
        </div>
        {properties.length > 0 && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 bg-teal text-white rounded-lg px-4 py-2 text-sm font-medium"
          >
            <Plus size={14} /> Add Unit
          </button>
        )}
      </div>

      {showForm && (
        <Card className="mt-6 p-5">
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-secondary">Property</label>
              <select
                required
                value={form.propertyId}
                onChange={(e) => setForm((f) => ({ ...f, propertyId: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
              >
                <option value="">Select a property</option>
                {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-secondary">Unit number</label>
              <input
                required
                value={form.unitNumber}
                onChange={(e) => setForm((f) => ({ ...f, unitNumber: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary">Monthly rent (₹)</label>
              <input
                required type="number" min="1"
                value={form.monthlyRent}
                onChange={(e) => setForm((f) => ({ ...f, monthlyRent: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary">Security deposit (₹)</label>
              <input
                required type="number" min="1"
                value={form.securityDeposit}
                onChange={(e) => setForm((f) => ({ ...f, securityDeposit: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
              >
                {UNIT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="col-span-2 bg-teal text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Unit"}
            </button>
          </form>
        </Card>
      )}

      <Card className="mt-6">
        {units.length === 0 ? (
          <EmptyState icon={Layers} title="No units yet — add your first one above." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-secondary border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="font-medium">Property</th>
                <th className="font-medium">Rent</th>
                <th className="font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 text-darktext font-medium">{u.unitNumber}</td>
                  <td className="text-secondary">{propertyName(u.propertyId)}</td>
                  <td className="text-darktext">₹{u.monthlyRent}</td>
                  <td><Badge tone={statusTone(u.status)}>{u.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
