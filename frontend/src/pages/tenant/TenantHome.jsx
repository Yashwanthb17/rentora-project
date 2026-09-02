import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMyAgreements } from "../../api/agreements";
import { getMyPayments } from "../../api/payments";
import { getMyMaintenanceRequests } from "../../api/maintenance";
import { Card, Badge, EmptyState, LoadingState, ErrorState, statusTone } from "../../components/ui";

export default function TenantHome() {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState(null);
  const [payments, setPayments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMyAgreements(), getMyPayments(), getMyMaintenanceRequests()])
      .then(([a, p, m]) => {
        setAgreements(a);
        setPayments(p);
        setTickets(m);
      })
      .catch(() => setError("Couldn't load your dashboard right now."));
  }, []);

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (agreements === null) return <LoadingState label="Loading your home..." />;

  const activeAgreement = agreements.find((a) => a.status === "ACTIVE");
  const nextPayment = payments.find((p) => p.status === "PENDING" || p.status === "OVERDUE");

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-darktext">Good morning, {user?.name?.split(" ")[0] || "there"}</h1>
      <p className="text-sm text-secondary mt-1">Here's what's happening with your rental.</p>

      {!activeAgreement ? (
        <Card className="mt-8">
          <EmptyState
            icon={Home}
            title="You haven't rented a home yet."
            action={
              <Link to="/properties" className="inline-flex items-center gap-1.5 bg-teal text-white rounded-lg px-4 py-2 text-sm font-medium">
                Explore Properties <ArrowRight size={14} />
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-darktext">My Home</p>
              <Badge tone={statusTone(activeAgreement.status)}>{activeAgreement.status}</Badge>
            </div>
            <p className="text-xs text-secondary">Unit ID {activeAgreement.unitId}</p>
            <div className="mt-3 text-sm text-darktext">Monthly rent: ₹{activeAgreement.monthlyRent?.toLocaleString?.("en-IN") ?? activeAgreement.monthlyRent}</div>
            <Link to="/tenant/agreement" className="inline-flex items-center gap-1 text-sm text-teal font-medium mt-3">
              View Agreement <ArrowRight size={13} />
            </Link>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-medium text-darktext mb-3">Next Payment</p>
            {nextPayment ? (
              <>
                <p className="text-xl font-semibold text-darktext">
                  ₹{nextPayment.amount?.toLocaleString?.("en-IN") ?? nextPayment.amount}
                </p>
                <p className="text-xs text-secondary mt-1">Due {nextPayment.dueDate}</p>
                <Link to="/tenant/payments" className="inline-flex items-center gap-1.5 bg-teal text-white rounded-lg px-4 py-2 text-sm font-medium mt-4">
                  Pay Rent
                </Link>
              </>
            ) : (
              <p className="text-sm text-secondary">No pending payments right now.</p>
            )}
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card className="p-5">
          <p className="text-sm font-medium text-darktext mb-3">Recent Payments</p>
          {payments.length === 0 ? (
            <p className="text-sm text-secondary">No payment history yet.</p>
          ) : (
            <div className="space-y-2">
              {payments.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-secondary">{p.billingPeriod}</span>
                  <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-darktext mb-3">Maintenance Requests</p>
          {tickets.length === 0 ? (
            <p className="text-sm text-secondary">No maintenance requests.</p>
          ) : (
            <div className="space-y-2">
              {tickets.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span className="text-secondary truncate">{t.title}</span>
                  <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
