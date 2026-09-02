import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllProperties } from "../../api/properties";
import { getAllUnits } from "../../api/units";
import { getApplicationsByUnit, approveApplication, rejectApplication } from "../../api/applications";
import { Card, Badge, LoadingState, ErrorState, EmptyState, statusTone } from "../../components/ui";
import { ClipboardList } from "lucide-react";

export default function OwnerApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState(null);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  function load() {
    Promise.all([getAllProperties(), getAllUnits()])
      .then(async ([allProperties, allUnits]) => {
        const myIds = new Set(allProperties.filter((p) => p.ownerId === user.id).map((p) => p.id));
        const myUnits = allUnits.filter((u) => myIds.has(u.propertyId));
        setUnits(myUnits);
        const lists = await Promise.all(myUnits.map((u) => getApplicationsByUnit(u.id).catch(() => [])));
        setApplications(lists.flat());
      })
      .catch(() => setError("Couldn't load applications."));
  }

  useEffect(load, [user.id]);

  async function handleApprove(id) {
    setBusyId(id);
    try {
      await approveApplication(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't approve that application.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id) {
    setBusyId(id);
    try {
      await rejectApplication(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't reject that application.");
    } finally {
      setBusyId(null);
    }
  }

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (applications === null) return <LoadingState />;

  const unitNumber = (id) => units.find((u) => u.id === id)?.unitNumber || `#${id}`;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-darktext">Applications</h1>
      <p className="text-sm text-secondary mt-1">Review and act on rental applications for your units.</p>

      <Card className="mt-6">
        {applications.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No applications yet." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-secondary border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Applicant</th>
                <th className="font-medium">Unit</th>
                <th className="font-medium">Applied Date</th>
                <th className="font-medium">Status</th>
                <th className="font-medium px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 text-darktext">Applicant #{a.tenantId}</td>
                  <td className="text-secondary">{unitNumber(a.unitId)}</td>
                  <td className="text-secondary">{a.appliedAt?.slice(0, 10)}</td>
                  <td><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
                  <td className="px-5">
                    {a.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(a.id)}
                          disabled={busyId === a.id}
                          className="text-xs font-medium bg-teal text-white rounded-lg px-3 py-1.5 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(a.id)}
                          disabled={busyId === a.id}
                          className="text-xs font-medium border border-slate-200 text-secondary rounded-lg px-3 py-1.5 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
