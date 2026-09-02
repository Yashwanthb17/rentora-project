import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/auth";
import { getAllProperties } from "../../api/properties";
import { getAllUnits } from "../../api/units";
import { KpiCard, LoadingState, ErrorState } from "../../components/ui";
import { Users, Building2, Layers, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAllUsers(), getAllProperties(), getAllUnits()])
      .then(([users, properties, units]) => setData({ users, properties, units }))
      .catch(() => setError("Couldn't load platform statistics."));
  }, []);

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (!data) return <LoadingState label="Loading platform data..." />;

  const { users, properties, units } = data;
  const owners = users.filter((u) => u.role === "OWNER").length;
  const tenants = users.filter((u) => u.role === "TENANT").length;
  const occupied = units.filter((u) => u.status === "OCCUPIED").length;

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-darktext">Platform Operations</h1>
      <p className="text-sm text-secondary mt-1">System-wide visibility across Rentora.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <KpiCard icon={Users} label="Total Users" value={users.length} />
        <KpiCard icon={ShieldCheck} label="Owners" value={owners} />
        <KpiCard icon={Users} label="Tenants" value={tenants} />
        <KpiCard icon={Building2} label="Properties" value={properties.length} />
        <KpiCard icon={Layers} label="Total Units" value={units.length} />
        <KpiCard icon={Layers} label="Occupied Units" value={occupied} />
      </div>
    </div>
  );
}
