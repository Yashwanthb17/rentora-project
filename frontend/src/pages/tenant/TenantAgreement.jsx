import React, { useEffect, useState } from "react";
import { getMyAgreements } from "../../api/agreements";
import { createTerminationRequest, getMyTerminationRequests } from "../../api/terminationRequests";
import { Card, Badge, LoadingState, ErrorState, EmptyState, statusTone } from "../../components/ui";
import { FileText } from "lucide-react";

export default function TenantAgreement() {
  const [agreements, setAgreements] = useState(null);
  const [terminations, setTerminations] = useState([]);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeAgreementId, setActiveAgreementId] = useState(null);

  function load() {
    Promise.all([getMyAgreements(), getMyTerminationRequests()])
      .then(([a, t]) => {
        setAgreements(a);
        setTerminations(t);
      })
      .catch(() => setError("Couldn't load your agreement."));
  }

  useEffect(load, []);

  async function handleRequestTermination(agreementId) {
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await createTerminationRequest(agreementId, reason);
      setReason("");
      setActiveAgreementId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit that request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (agreements === null) return <LoadingState />;

  const active = agreements.find((a) => a.status === "ACTIVE");

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold text-darktext">Rental Agreement</h1>
      <p className="text-sm text-secondary mt-1">Your lease details and termination requests.</p>

      {!active ? (
        <Card className="mt-6">
          <EmptyState icon={FileText} title="You don't have an active rental agreement." />
        </Card>
      ) : (
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-darktext">Agreement #{active.id}</p>
            <Badge tone={statusTone(active.status)}>{active.status}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div><p className="text-xs text-secondary">Unit</p><p className="text-darktext">Unit #{active.unitId}</p></div>
            <div><p className="text-xs text-secondary">Monthly rent</p><p className="text-darktext">₹{active.monthlyRent}</p></div>
            <div><p className="text-xs text-secondary">Security deposit</p><p className="text-darktext">₹{active.securityDeposit}</p></div>
            <div><p className="text-xs text-secondary">Start date</p><p className="text-darktext">{active.startDate}</p></div>
            <div><p className="text-xs text-secondary">End date</p><p className="text-darktext">{active.endDate}</p></div>
          </div>

          {terminations.some((t) => t.agreementId === active.id && t.status === "PENDING") ? (
            <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3">
              Termination requested — pending owner review.
            </div>
          ) : activeAgreementId === active.id ? (
            <div className="mt-6 space-y-2">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why are you requesting to end this lease?"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleRequestTermination(active.id)}
                  disabled={submitting}
                  className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-2 text-sm font-medium"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setActiveAgreementId(null)}
                  className="border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActiveAgreementId(active.id)}
              className="mt-6 text-sm font-medium text-red-600 border border-red-200 bg-red-50 rounded-lg px-4 py-2"
            >
              Request Lease Termination
            </button>
          )}
        </Card>
      )}
    </div>
  );
}
