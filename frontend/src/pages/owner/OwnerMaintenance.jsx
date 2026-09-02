import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllProperties } from "../../api/properties";
import { getAllUnits } from "../../api/units";
import { getMaintenanceByUnit, startMaintenanceRequest, resolveMaintenanceRequest } from "../../api/maintenance";
import { Card, Badge, LoadingState, ErrorState, EmptyState, statusTone } from "../../components/ui";
import { Wrench } from "lucide-react";

export default function OwnerMaintenance() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(null);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    try {
      const [allProperties, allUnits] = await Promise.all([getAllProperties(), getAllUnits()]);
      const myIds = new Set(allProperties.filter((p) => p.ownerId === user.id).map((p) => p.id));
      const myUnits = allUnits.filter((u) => myIds.has(u.propertyId));
      setUnits(myUnits);
      const byUnit = await Promise.all(myUnits.map((u) => getMaintenanceByUnit(u.id).catch(() => [])));
      setTickets(byUnit.flat());
    } catch {
      setError("Couldn't load maintenance requests.");
    }
  }

  useEffect(() => { load(); }, [user.id]);

  async function handleStart(id) {
    setBusyId(id);
    try { await startMaintenanceRequest(id); load(); }
    catch (err) { setError(err.response?.data?.message || "Couldn't start that request."); }
    finally { setBusyId(null); }
  }

  async function handleResolve(id) {
    setBusyId(id);
    try { await resolveMaintenanceRequest(id); load(); }
    catch (err) { setError(err.response?.data?.message || "Couldn't resolve that request."); }
    finally { setBusyId(null); }
  }

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (tickets === null) return <LoadingState />;

  const unitNumber = (id) => units.find((u) => u.id === id)?.unitNumber || `#${id}`;
  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-darktext">Maintenance</h1>
      <p className="text-sm text-secondary mt-1">Track and resolve issues raised by tenants.</p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card className="p-4"><p className="text-xs text-secondary">Open</p><p className="text-xl font-semibold text-darktext mt-1">{open}</p></Card>
        <Card className="p-4"><p className="text-xs text-secondary">In Progress</p><p className="text-xl font-semibold text-darktext mt-1">{inProgress}</p></Card>
        <Card className="p-4"><p className="text-xs text-secondary">Resolved</p><p className="text-xl font-semibold text-darktext mt-1">{resolved}</p></Card>
      </div>

      <Card className="mt-6">
        {tickets.length === 0 ? (
          <EmptyState icon={Wrench} title="No maintenance requests." />
        ) : (
          <div className="divide-y divide-slate-50">
            {tickets.map((t) => (
              <div key={t.id} className="px-5 py-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-darktext truncate">{t.title}</p>
                  <p className="text-xs text-secondary mt-0.5">{unitNumber(t.unitId)} • {t.priority}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                  {t.status === "OPEN" && (
                    <button
                      onClick={() => handleStart(t.id)}
                      disabled={busyId === t.id}
                      className="text-xs font-medium bg-teal text-white rounded-lg px-3 py-1.5 disabled:opacity-60"
                    >
                      Start
                    </button>
                  )}
                  {t.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => handleResolve(t.id)}
                      disabled={busyId === t.id}
                      className="text-xs font-medium bg-teal text-white rounded-lg px-3 py-1.5 disabled:opacity-60"
                    >
                      Resolve
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
