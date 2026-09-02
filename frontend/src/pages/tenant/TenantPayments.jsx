import React, { useEffect, useState } from "react";
import { getMyPayments, payPayment } from "../../api/payments";
import { Card, Badge, LoadingState, ErrorState, EmptyState, statusTone } from "../../components/ui";
import { CreditCard } from "lucide-react";

export default function TenantPayments() {
  const [payments, setPayments] = useState(null);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState(null);

  function load() {
    getMyPayments().then(setPayments).catch(() => setError("Couldn't load your payments."));
  }

  useEffect(load, []);

  async function handlePay(id) {
    setPayingId(id);
    try {
      await payPayment(id, "UPI", `TXN-${Date.now()}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed.");
    } finally {
      setPayingId(null);
    }
  }

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (payments === null) return <LoadingState />;

  const current = payments.find((p) => p.status !== "PAID");
  const pendingCount = payments.filter((p) => p.status === "PENDING" || p.status === "OVERDUE").length;
  const paidThisYear = payments.filter((p) => p.status === "PAID").length;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-darktext">Payments</h1>
      <p className="text-sm text-secondary mt-1">Manage your rent payments and history.</p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card className="p-4"><p className="text-xs text-secondary">Current Rent</p><p className="text-xl font-semibold text-darktext mt-1">₹{current?.amount ?? "-"}</p></Card>
        <Card className="p-4"><p className="text-xs text-secondary">Pending Payments</p><p className="text-xl font-semibold text-darktext mt-1">{pendingCount}</p></Card>
        <Card className="p-4"><p className="text-xs text-secondary">Paid This Year</p><p className="text-xl font-semibold text-darktext mt-1">{paidThisYear}</p></Card>
      </div>

      <Card className="mt-6">
        {payments.length === 0 ? (
          <EmptyState icon={CreditCard} title="No payment history yet." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-secondary border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Billing Period</th>
                <th className="font-medium">Amount</th>
                <th className="font-medium">Due Date</th>
                <th className="font-medium">Status</th>
                <th className="font-medium px-5">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 text-darktext">{p.billingPeriod}</td>
                  <td className="text-darktext">₹{p.amount}</td>
                  <td className="text-secondary">{p.dueDate}</td>
                  <td><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
                  <td className="px-5">
                    {p.status !== "PAID" && (
                      <button
                        onClick={() => handlePay(p.id)}
                        disabled={payingId === p.id}
                        className="text-xs font-medium bg-teal text-white rounded-lg px-3 py-1.5 disabled:opacity-60"
                      >
                        {payingId === p.id ? "Paying..." : "Pay Now"}
                      </button>
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
