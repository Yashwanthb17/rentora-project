import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllProperties } from "../../api/properties";
import { getAllUnits } from "../../api/units";
import { getAgreementsByUnit, terminateAgreement } from "../../api/agreements";
import { getTerminationRequestsByAgreement, approveTerminationRequest, rejectTerminationRequest } from "../../api/terminationRequests";
import { Card, Badge, LoadingState, ErrorState, EmptyState, statusTone } from "../../components/ui";
import { FileText } from "lucide-react";

export default function OwnerAgreements() {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState(null);
  const [units, setUnits] = useState([]);
  const [terminationsByAgreement, setTerminationsByAgreement] = useState({});
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    try {
      const [allProperties, allUnits] = await Promise.all([getAllProperties(), getAllUnits()]);
      const myIds = new Set(allProperties.filter((p) => p.ownerId === user.id).map((p) => p.id));
      const myUnits = allUnits.filter((u) => myIds.has(u.propertyId));
      setUnits(myUnits);

      const byUnit = await Promise.all(myUnits.map((u) => getAgreementsByUnit(u.id).catch(() => [])));
      const flat = byUnit.flat();
      setAgreements(flat);

      const terminations = await Promise.all(
        flat.map((a) => getTerminationRequestsByAgreement(a.id).catch(() => []))
      );
      const map = {};
      flat.forEach((a, i) => { map[a.id] = terminations[i]; });
      setTerminationsByAgreement(map);
    } catch {
      setError("Couldn't load rental agreements.");
    }
  }

  useEffect(() => { load(); }, [user.id]);

  async function handleTerminate(id) {
    setBusyId(id);
    try {
      await terminateAgreement(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't terminate that agreement.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleApproveTermination(terminationId) {
    setBusyId(terminationId);
    try {
      await approveTerminationRequest(terminationId);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't approve that request.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleRejectTermination(terminationId) {
    setBusyId(terminationId);
    try {
      await rejectTerminationRequest(terminationId);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't reject that request.");
    } finally {
      setBusyId(null);
    }
  }

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (agreements === null) return <LoadingState />;

  const unitNumber = (id) => units.find((u) => u.id === id)?.unitNumber || `#${id}`;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-darktext">Rental Agreements</h1>
      <p className="text-sm text-secondary mt-1">Active leases and termination requests across your units.</p>

      <Card className="mt-6">
        {agreements.length === 0 ? (
          <EmptyState icon={FileText} title="No rental agreements yet." />
        ) : (
          <div className="divide-y divide-slate-50">
            {agreements.map((a) => {
              const pendingTermination = (terminationsByAgreement[a.id] || []).find((t) => t.status === "PENDING");
              return (
                <div key={a.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-darktext">{unitNumber(a.unitId)} — Tenant #{a.tenantId}</p>
                      <p className="text-xs text-secondary mt-0.5">
                        ₹{a.monthlyRent}/mo • {a.startDate} → {a.endDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone={statusTone(pendingTermination ? "PENDING" : a.status)}>
                        {pendingTermination ? "PENDING TERMINATION" : a.status}
                      </Badge>
                      {a.status === "ACTIVE" && !pendingTermination && (
                        <button
                          onClick={() => handleTerminate(a.id)}
                          disabled={busyId === a.id}
                          className="text-xs font-medium border border-red-200 text-red-600 bg-red-50 rounded-lg px-3 py-1.5 disabled:opacity-60"
                        >
                          Terminate
                        </button>
                      )}
                    </div>
                  </div>

                  {pendingTermination && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                      <p className="text-xs text-amber-700">"{pendingTermination.reason}"</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleApproveTermination(pendingTermination.id)}
                          disabled={busyId === pendingTermination.id}
                          className="text-xs font-medium bg-teal text-white rounded-lg px-3 py-1.5 disabled:opacity-60"
                        >
                          Approve Termination
                        </button>
                        <button
                          onClick={() => handleRejectTermination(pendingTermination.id)}
                          disabled={busyId === pendingTermination.id}
                          className="text-xs font-medium border border-slate-200 text-secondary rounded-lg px-3 py-1.5 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
