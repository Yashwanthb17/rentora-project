import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../api/properties";
import { getAllUnits } from "../api/units";
import { createApplication } from "../api/applications";
import { useAuth } from "../context/AuthContext";
import PublicNavbar from "../components/PublicNavbar";
import { Card, Badge, LoadingState, ErrorState, statusTone } from "../components/ui";
import { MapPin } from "lucide-react";

export default function PropertyDetail() {
  const { propertyId } = useParams();
  const { isAuthenticated, role } = useAuth();
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState("");
  const [promptUnitId, setPromptUnitId] = useState(null);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState([]);

  useEffect(() => {
    Promise.all([getPropertyById(propertyId), getAllUnits()])
      .then(([p, allUnits]) => {
        setProperty(p);
        setUnits(allUnits.filter((u) => u.propertyId === Number(propertyId)));
      })
      .catch(() => setError("Couldn't load this property."));
  }, [propertyId]);

  async function handleApply(unitId) {
    if (!isAuthenticated) {
      setPromptUnitId(unitId);
      return;
    }
    if (role !== "TENANT") return;
    setApplyingId(unitId);
    try {
      await createApplication(unitId, "I'm interested in this unit.");
      setAppliedIds((ids) => [...ids, unitId]);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit your application.");
    } finally {
      setApplyingId(null);
    }
  }

  if (error) return <div className="p-8 max-w-2xl mx-auto"><ErrorState message={error} /></div>;
  if (property === null) return <LoadingState />;

  return (
    <div className="min-h-screen bg-canvas">
      <PublicNavbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="h-64 rounded-2xl" style={{ background: "linear-gradient(135deg, #EDF5F5, #F3EDE3)" }} />

        <div className="mt-6">
          <h1 className="text-3xl font-semibold text-darktext">{property.title}</h1>
          <p className="text-sm text-secondary flex items-center gap-1 mt-1">
            <MapPin size={13} /> {property.address}, {property.city}, {property.state} {property.pincode}
          </p>
          <p className="text-sm text-secondary mt-4 max-w-2xl">{property.description}</p>
        </div>

        <h2 className="text-xl font-semibold text-darktext mt-10 mb-4">Available Units</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {units.map((u) => (
            <Card key={u.id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-darktext">Unit {u.unitNumber}</p>
                <Badge tone={statusTone(u.status)}>{u.status}</Badge>
              </div>
              <p className="text-sm text-darktext">₹{u.monthlyRent}/month</p>
              <p className="text-xs text-secondary mt-1">₹{u.securityDeposit} security deposit</p>

              {u.status === "AVAILABLE" && (
                appliedIds.includes(u.id) ? (
                  <p className="text-xs text-teal font-medium mt-4">Application submitted</p>
                ) : (
                  <button
                    onClick={() => handleApply(u.id)}
                    disabled={applyingId === u.id}
                    className="mt-4 bg-teal text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
                  >
                    {applyingId === u.id ? "Submitting..." : "Apply for this Unit"}
                  </button>
                )
              )}

              {promptUnitId === u.id && (
                <div className="mt-4 bg-sage border border-teal/20 rounded-lg px-4 py-3">
                  <p className="text-sm text-darktext">Sign in to apply for this unit.</p>
                  <div className="flex gap-2 mt-2">
                    <Link to="/login" className="text-xs font-medium bg-teal text-white rounded-lg px-3 py-1.5">Login</Link>
                    <Link to="/register" className="text-xs font-medium border border-teal text-teal rounded-lg px-3 py-1.5">Create Account</Link>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
