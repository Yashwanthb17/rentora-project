import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllProperties } from "../../api/properties";
import { getAllUnits } from "../../api/units";
import { getAgreementsByUnit } from "../../api/agreements";
import { getPaymentsByAgreement } from "../../api/payments";
import { Card, Badge, KpiCard, LoadingState, ErrorState, EmptyState, statusTone } from "../../components/ui";
import { CreditCard, TrendingUp, AlertTriangle } from "lucide-react";

export default function OwnerPayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState(null);
  const [units, setUnits] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [allProperties, allUnits] = await Promise.all([getAllProperties(), getAllUnits()]);
        const myIds = new Set(allProperties.filter((p) => p.ownerId === user.id).map((p) => p.id));
        const myUnits = allUnits.filter((u) => myIds.has(u.propertyId));
        setUnits(myUnits);

        const byUnit = await Promise.all(myUnits.map((u) => getAgreementsByUnit(u.id).catch(() => [])));
        const flatAgreements = byUnit.flat();
        setAgreements(flatAgreements);

        const byAgreement = await Promise.all(
          flatAgreements.map((a) => getPaymentsByAgreement(a.id).catch(() => []))
        );
        setPayments(byAgreement.flat());
      } catch {
        setError("Couldn't load payments.");
      }
    }
    load();
  }, [user.id]);

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (payments === null) return <LoadingState />;

  const unitForAgreement = (agreementId) => {
    const agreement = agreements.find((a) => a.id === agreementId);
    return units.find((u) => u.id === agreement?.unitId)?.unitNumber || "—";
  };

  const expected = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const collected = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + Number(p.amount || 0), 0);
  const pending = payments.filter((p) => p.status === "PENDING").length;
  const overdue = payments.filter((p) => p.status === "OVERDUE").length;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-darktext">Payments</h1>
      <p className="text-sm text-secondary mt-1">Rent collection across your portfolio.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <KpiCard icon={TrendingUp} label="Expected This Month" value={`₹${expected.toLocaleString("en-IN")}`} />
        <KpiCard icon={TrendingUp} label="Collected" value={`₹${collected.toLocaleString("en-IN")}`} />
        <KpiCard icon={AlertTriangle} label="Pending" value={pending} />
        <KpiCard icon={AlertTriangle} label="Overdue" value={overdue} />
      </div>

      <Card className="mt-6">
        {payments.length === 0 ? (
          <EmptyState icon={CreditCard} title="No payments recorded yet." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-secondary border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="font-medium">Billing Period</th>
                <th className="font-medium">Amount</th>
                <th className="font-medium">Due Date</th>
                <th className="font-medium px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 text-darktext">{unitForAgreement(p.agreementId)}</td>
                  <td className="text-secondary">{p.billingPeriod}</td>
                  <td className="text-darktext">₹{p.amount}</td>
                  <td className="text-secondary">{p.dueDate}</td>
                  <td className="px-5"><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
