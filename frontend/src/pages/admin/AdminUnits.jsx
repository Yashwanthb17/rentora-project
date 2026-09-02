import React, { useEffect, useState } from "react";
import { getAllUnits } from "../../api/units";
import { getAllProperties } from "../../api/properties";
import { Card, Badge, LoadingState, ErrorState, statusTone } from "../../components/ui";

export default function AdminUnits() {
  const [units, setUnits] = useState(null);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAllUnits(), getAllProperties()])
      .then(([u, p]) => { setUnits(u); setProperties(p); })
      .catch(() => setError("Couldn't load units."));
  }, []);

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (units === null) return <LoadingState />;

  const propertyTitle = (id) => properties.find((p) => p.id === id)?.title || `#${id}`;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-darktext">Units</h1>
      <p className="text-sm text-secondary mt-1">Every unit across the platform.</p>

      <Card className="mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-secondary border-b border-slate-100">
              <th className="px-5 py-3 font-medium">Unit</th>
              <th className="font-medium">Property</th>
              <th className="font-medium">Rent</th>
              <th className="font-medium px-5">Status</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 text-darktext font-medium">{u.unitNumber}</td>
                <td className="text-secondary">{propertyTitle(u.propertyId)}</td>
                <td className="text-darktext">₹{u.monthlyRent}</td>
                <td className="px-5"><Badge tone={statusTone(u.status)}>{u.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
