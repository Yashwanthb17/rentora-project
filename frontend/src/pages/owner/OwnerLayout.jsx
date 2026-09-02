import React from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Building2, Layers, ClipboardList, FileText, CreditCard, Wrench } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";

const nav = [
  { to: "/owner", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/owner/properties", label: "Properties", icon: Building2 },
  { to: "/owner/units", label: "Units", icon: Layers },
  { to: "/owner/applications", label: "Applications", icon: ClipboardList },
  { to: "/owner/agreements", label: "Rental Agreements", icon: FileText },
  { to: "/owner/payments", label: "Payments", icon: CreditCard },
  { to: "/owner/maintenance", label: "Maintenance", icon: Wrench },
];

export default function OwnerLayout() {
  return (
    <DashboardShell nav={nav}>
      <Outlet />
    </DashboardShell>
  );
}
