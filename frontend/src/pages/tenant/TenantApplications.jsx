import React, { useEffect, useState } from "react";
import { getMyApplications } from "../../api/applications";
import { Card, Badge, LoadingState, ErrorState, EmptyState, statusTone } from "../../components/ui";
import { ClipboardList } from "lucide-react";

export default function TenantApplications() {
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyApplications()
      .then(setApplications)
      .catch(() => setError("Couldn't load your applications."));
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-darktext">Applications</h1>
      <p className="text-sm text-secondary mt-1">Track every unit you've applied for.</p>

      <Card className="mt-6">
        {error && <div className="p-6"><ErrorState message={error} /></div>}
        {!error && applications === null && <LoadingState />}
        {applications?.length === 0 && (
          <EmptyState icon={ClipboardList} title="You haven't submitted any applications yet." />
        )}
        {applications?.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-secondary border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="font-medium">Applied On</th>
                <th className="font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 text-darktext">Unit #{a.unitId}</td>
                  <td className="text-secondary">{a.appliedAt?.slice(0, 10)}</td>
                  <td><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
