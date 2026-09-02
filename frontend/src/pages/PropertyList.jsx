import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProperties } from "../api/properties";
import { getAllUnits } from "../api/units";
import PublicNavbar from "../components/PublicNavbar";
import { Card, LoadingState, ErrorState, EmptyState } from "../components/ui";
import { MapPin, Building2 } from "lucide-react";

export default function PropertyList() {
  const [properties, setProperties] = useState(null);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    Promise.all([getAllProperties(), getAllUnits()])
      .then(([p, u]) => { setProperties(p); setUnits(u); })
      .catch(() => setError("Couldn't load properties right now."));
  }, []);

  if (error) return <div className="p-8 max-w-2xl mx-auto"><ErrorState message={error} /></div>;

  const filtered = properties?.filter((p) => {
    const q = query.toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-canvas">
      <PublicNavbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-darktext">Find your next home.</h1>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by property name or city..."
          className="w-full max-w-md mt-6 rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal bg-white"
        />

        {properties === null ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <Card className="mt-8"><EmptyState icon={Building2} title="No properties match your search." /></Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {filtered.map((p) => {
              const propUnits = units.filter((u) => u.propertyId === p.id);
              const available = propUnits.filter((u) => u.status === "AVAILABLE");
              const minRent = propUnits.length
                ? Math.min(...propUnits.map((u) => Number(u.monthlyRent)))
                : null;
              return (
                <Link key={p.id} to={`/properties/${p.id}`}>
                  <Card className="overflow-hidden hover:-translate-y-1 transition-transform">
                    <div className="h-36" style={{ background: "linear-gradient(135deg, #EDF5F5, #F3EDE3)" }} />
                    <div className="p-5">
                      <p className="text-base font-semibold text-darktext">{p.title}</p>
                      <p className="text-xs text-secondary flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {p.city}, {p.state}
                      </p>
                      <p className="text-xs text-secondary mt-2">{propUnits.length} units • {available.length} available</p>
                      {minRent !== null && (
                        <p className="text-sm font-medium text-teal mt-3">From ₹{minRent.toLocaleString("en-IN")}/month</p>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
