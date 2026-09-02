import React from "react";

export function Badge({ tone = "slate", children }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border border-amber-200",
    red: "bg-red-50 text-red-700 border border-red-200",
    teal: "bg-sage text-teal border border-teal/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Card({ className = "", children }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function KpiCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-secondary">{label}</span>
        <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-sage text-teal">
          <Icon size={18} />
        </div>
      </div>
      <div className="text-2xl font-semibold text-darktext tracking-tight">{value}</div>
      {sub && <div className="text-xs text-secondary">{sub}</div>}
    </Card>
  );
}

export function ProgressBar({ percent }) {
  return (
    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-teal transition-all duration-700"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-sage text-teal flex items-center justify-center mb-4">
          <Icon size={20} />
        </div>
      )}
      <p className="text-sm text-secondary max-w-xs">{title}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-secondary">
      <span className="h-4 w-4 rounded-full border-2 border-teal border-t-transparent animate-spin mr-2" />
      {label}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
      {message}
    </div>
  );
}

export function statusTone(status) {
  const map = {
    ACTIVE: "green", RESOLVED: "green", PAID: "green", APPROVED: "green", AVAILABLE: "green",
    PENDING: "amber", IN_PROGRESS: "amber", OPEN: "amber",
    OVERDUE: "red", REJECTED: "red", TERMINATED: "red", CANCELLED: "red",
    OCCUPIED: "slate",
  };
  return map[status] || "slate";
}
