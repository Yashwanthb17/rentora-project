import React, { useEffect, useState } from "react";
import { getAllProperties } from "../../api/properties";
import { getAllUnits } from "../../api/units";
import { Card, Badge } from "../../components/ui";
import { LoadingState, ErrorState } from "../../components/ui";

export default function AdminProperties() {
  const [properties, setProperties] = useState(null);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAllProperties(), getAllUnits()])
      .then(([p, u]) => { setProperties(p); setUnits(u); })
      .catch(() => setError("Couldn't load properties."));
  }, []);

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (properties === null) return <LoadingState />;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-darktext">Properties</h1>
      <p className="text-sm text-secondary mt-1">Every property listed on Rentora.</p>

      <Card className="mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-secondary border-b border-slate-100">
              <th className="px-5 py-3 font-medium">Property</th>
              <th className="font-medium">Owner</th>
              <th className="font-medium">Location</th>
              <th className="font-medium px-5">Units</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 text-darktext font-medium">{p.title}</td>
                <td className="text-secondary">Owner #{p.ownerId}</td>
                <td className="text-secondary">{p.city}, {p.state}</td>
                <td className="px-5 text-darktext">{units.filter((u) => u.propertyId === p.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
