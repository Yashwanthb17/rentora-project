import React, { useEffect, useState } from "react";
import { getMyMaintenanceRequests, createMaintenanceRequest, cancelMaintenanceRequest } from "../../api/maintenance";
import { getMyAgreements } from "../../api/agreements";
import { Card, Badge, LoadingState, ErrorState, EmptyState, statusTone } from "../../components/ui";
import { Wrench, Plus } from "lucide-react";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function TenantMaintenance() {
  const [tickets, setTickets] = useState(null);
  const [unitId, setUnitId] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "MEDIUM" });
  const [submitting, setSubmitting] = useState(false);

  function load() {
    Promise.all([getMyMaintenanceRequests(), getMyAgreements()])
      .then(([m, agreements]) => {
        setTickets(m);
        const active = agreements.find((a) => a.status === "ACTIVE");
        setUnitId(active?.unitId ?? null);
      })
      .catch(() => setError("Couldn't load maintenance requests."));
  }

  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!unitId) return;
    setSubmitting(true);
    try {
      await createMaintenanceRequest({ unitId, ...form });
      setForm({ title: "", description: "", priority: "MEDIUM" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit that request.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(id) {
    try {
      await cancelMaintenanceRequest(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't cancel that request.");
    }
  }

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (tickets === null) return <LoadingState />;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-darktext">My Maintenance Requests</h1>
          <p className="text-sm text-secondary mt-1">Raise and track issues in your unit.</p>
        </div>
        {unitId && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 bg-teal text-white rounded-lg px-4 py-2 text-sm font-medium"
          >
            <Plus size={14} /> Raise Maintenance Request
          </button>
        )}
      </div>

      {showForm && (
        <Card className="mt-6 p-5">
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-secondary">Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary">Description</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
              >
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-teal text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </Card>
      )}

      <Card className="mt-6">
        {tickets.length === 0 ? (
          <EmptyState icon={Wrench} title="No maintenance requests." />
        ) : (
          <div className="divide-y divide-slate-50">
            {tickets.map((t) => (
              <div key={t.id} className="px-5 py-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-darktext truncate">{t.title}</p>
                  <p className="text-xs text-secondary mt-0.5">{t.priority} • {t.createdAt?.slice(0, 10)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                  {(t.status === "OPEN") && (
                    <button
                      onClick={() => handleCancel(t.id)}
                      className="text-xs font-medium text-secondary hover:text-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
