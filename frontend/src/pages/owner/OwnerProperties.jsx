import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllProperties, createProperty } from "../../api/properties";
import { getAllUnits } from "../../api/units";
import { Card, Badge, LoadingState, ErrorState, EmptyState } from "../../components/ui";
import { Building2, Plus } from "lucide-react";

const PROPERTY_TYPES = ["APARTMENT", "HOUSE", "VILLA", "PG", "COMMERCIAL"];

export default function OwnerProperties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState(null);
  const [unitsByProperty, setUnitsByProperty] = useState({});
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", address: "", city: "", state: "", pincode: "", propertyType: "APARTMENT",
  });

  function load() {
    Promise.all([getAllProperties(), getAllUnits()])
      .then(([allProperties, allUnits]) => {
        const mine = allProperties.filter((p) => p.ownerId === user.id);
        setProperties(mine);
        const grouped = {};
        allUnits.forEach((u) => {
          grouped[u.propertyId] = grouped[u.propertyId] || [];
          grouped[u.propertyId].push(u);
        });
        setUnitsByProperty(grouped);
      })
      .catch(() => setError("Couldn't load your properties."));
  }

  useEffect(load, [user.id]);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createProperty(form);
      setShowForm(false);
      setForm({ title: "", description: "", address: "", city: "", state: "", pincode: "", propertyType: "APARTMENT" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create that property.");
    } finally {
      setSubmitting(false);
    }
  }

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (properties === null) return <LoadingState />;

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-darktext">Properties</h1>
          <p className="text-sm text-secondary mt-1">Everything you manage, in one place.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 bg-teal text-white rounded-lg px-4 py-2 text-sm font-medium"
        >
          <Plus size={14} /> Add Property
        </button>
      </div>

      {showForm && (
        <Card className="mt-6 p-5">
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
            {[
              ["title", "Property name"], ["address", "Address"], ["city", "City"],
              ["state", "State"], ["pincode", "Pincode"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs font-medium text-secondary">{label}</label>
                <input
                  required
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-secondary">Property type</label>
              <select
                value={form.propertyType}
                onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
              >
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-secondary">Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="col-span-2 bg-teal text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Property"}
            </button>
          </form>
        </Card>
      )}

      <Card className="mt-6">
        {properties.length === 0 ? (
          <EmptyState icon={Building2} title="Your property portfolio starts here." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-secondary border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Property</th>
                <th className="font-medium">Location</th>
                <th className="font-medium">Total Units</th>
                <th className="font-medium">Occupied</th>
                <th className="font-medium">Available</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => {
                const units = unitsByProperty[p.id] || [];
                const occ = units.filter((u) => u.status === "OCCUPIED").length;
                const avail = units.filter((u) => u.status === "AVAILABLE").length;
                return (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3 text-darktext font-medium">{p.title}</td>
                    <td className="text-secondary">{p.city}, {p.state}</td>
                    <td className="text-darktext">{units.length}</td>
                    <td className="text-darktext">{occ}</td>
                    <td className="text-darktext">{avail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
