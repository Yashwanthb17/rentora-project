import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllProperties } from "../../api/properties";
import { getAllUnits } from "../../api/units";
import { getApplicationsByUnit } from "../../api/applications";
import { getAgreementsByUnit } from "../../api/agreements";
import { getPaymentsByAgreement } from "../../api/payments";
import { getMaintenanceByUnit } from "../../api/maintenance";
import { KpiCard, Card, ProgressBar, LoadingState, ErrorState } from "../../components/ui";
import { Building2, Layers, Users, TrendingUp, AlertTriangle, ClipboardList } from "lucide-react";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [allProperties, allUnits] = await Promise.all([getAllProperties(), getAllUnits()]);
        const myProperties = allProperties.filter((p) => p.ownerId === user.id);
        const myPropertyIds = new Set(myProperties.map((p) => p.id));
        const myUnits = allUnits.filter((u) => myPropertyIds.has(u.propertyId));

        const [applicationsByUnit, agreementsByUnit, maintenanceByUnit] = await Promise.all([
          Promise.all(myUnits.map((u) => getApplicationsByUnit(u.id).catch(() => []))),
          Promise.all(myUnits.map((u) => getAgreementsByUnit(u.id).catch(() => []))),
          Promise.all(myUnits.map((u) => getMaintenanceByUnit(u.id).catch(() => []))),
        ]);

        const applications = applicationsByUnit.flat();
        const agreements = agreementsByUnit.flat();
        const maintenance = maintenanceByUnit.flat();

        const activeAgreements = agreements.filter((a) => a.status === "ACTIVE");
        const paymentsByAgreement = await Promise.all(
          activeAgreements.map((a) => getPaymentsByAgreement(a.id).catch(() => []))
        );
        const payments = paymentsByAgreement.flat();

        setData({ myProperties, myUnits, applications, agreements, maintenance, payments });
      } catch {
        setError("Couldn't load your dashboard right now.");
      }
    }
    load();
  }, [user.id]);

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (!data) return <LoadingState label="Loading your portfolio..." />;

  const { myProperties, myUnits, applications, maintenance, payments } = data;
  const occupied = myUnits.filter((u) => u.status === "OCCUPIED").length;
  const available = myUnits.filter((u) => u.status === "AVAILABLE").length;
  const expected = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const collected = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + Number(p.amount || 0), 0);
  const pendingPayments = payments.filter((p) => p.status !== "PAID").length;
  const collectionPct = expected > 0 ? Math.round((collected / expected) * 100) : 0;

  const open = maintenance.filter((m) => m.status === "OPEN").length;
  const inProgress = maintenance.filter((m) => m.status === "IN_PROGRESS").length;
  const resolved = maintenance.filter((m) => m.status === "RESOLVED").length;
  const pendingApplications = applications.filter((a) => a.status === "PENDING");

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-darktext">Good morning, {user?.name?.split(" ")[0]}</h1>
      <p className="text-sm text-secondary mt-1">Your portfolio at a glance.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <KpiCard icon={Building2} label="Total Properties" value={myProperties.length} />
        <KpiCard icon={Layers} label="Total Units" value={myUnits.length} />
        <KpiCard icon={Users} label="Occupied Units" value={occupied} />
        <KpiCard icon={Layers} label="Available Units" value={available} />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <KpiCard icon={TrendingUp} label="Monthly Expected Rent" value={`₹${expected.toLocaleString("en-IN")}`} />
        <KpiCard icon={TrendingUp} label="Collected This Month" value={`₹${collected.toLocaleString("en-IN")}`} />
        <KpiCard icon={AlertTriangle} label="Pending Payments" value={pendingPayments} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card className="p-5">
          <p className="text-sm font-medium text-darktext mb-3">Rent Collection — this cycle</p>
          <ProgressBar percent={collectionPct} />
          <p className="text-xs text-secondary mt-2">{collectionPct}% collected</p>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-darktext mb-3">Maintenance</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-secondary">Open</span><span className="font-medium text-darktext">{open}</span></div>
            <div className="flex justify-between"><span className="text-secondary">In Progress</span><span className="font-medium text-darktext">{inProgress}</span></div>
            <div className="flex justify-between"><span className="text-secondary">Resolved</span><span className="font-medium text-darktext">{resolved}</span></div>
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList size={16} className="text-teal" />
          <p className="text-sm font-medium text-darktext">Pending Applications ({pendingApplications.length})</p>
        </div>
        {pendingApplications.length === 0 ? (
          <p className="text-sm text-secondary">Nothing waiting on you right now.</p>
        ) : (
          <div className="space-y-2">
            {pendingApplications.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="text-darktext">Unit #{a.unitId} — applicant #{a.tenantId}</span>
                <span className="text-secondary">{a.appliedAt?.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
