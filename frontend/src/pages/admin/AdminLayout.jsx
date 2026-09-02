import React from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Building2, Layers } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/units", label: "Units", icon: Layers },
];

export default function AdminLayout() {
  return (
    <DashboardShell nav={nav}>
      <Outlet />
    </DashboardShell>
  );
}
