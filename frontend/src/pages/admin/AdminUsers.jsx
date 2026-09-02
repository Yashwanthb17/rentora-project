import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/auth";
import { Card, Badge, LoadingState, ErrorState } from "../../components/ui";

export default function AdminUsers() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllUsers().then(setUsers).catch(() => setError("Couldn't load users."));
  }, []);

  if (error) return <div className="p-8"><ErrorState message={error} /></div>;
  if (users === null) return <LoadingState />;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-darktext">Users</h1>
      <p className="text-sm text-secondary mt-1">Everyone with a Rentora account.</p>

      <Card className="mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-secondary border-b border-slate-100">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="font-medium">Email</th>
              <th className="font-medium">Role</th>
              <th className="font-medium px-5">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 text-darktext font-medium">{u.name}</td>
                <td className="text-secondary">{u.email}</td>
                <td className="text-secondary">{u.role}</td>
                <td className="px-5">
                  <Badge tone={u.active ? "green" : "red"}>{u.active ? "Active" : "Disabled"}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
