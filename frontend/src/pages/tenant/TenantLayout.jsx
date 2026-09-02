import React from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, ClipboardList, CreditCard, Wrench } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";

const nav = [
  { to: "/tenant", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/tenant/applications", label: "Applications", icon: ClipboardList },
  { to: "/tenant/agreement", label: "Rental Agreement", icon: FileText },
  { to: "/tenant/payments", label: "Payments", icon: CreditCard },
  { to: "/tenant/maintenance", label: "Maintenance", icon: Wrench },
];

export default function TenantLayout() {
  return (
    <DashboardShell nav={nav}>
      <Outlet />
    </DashboardShell>
  );
}
