import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Landing from "./pages/Landing";
import PropertyList from "./pages/PropertyList";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

import TenantLayout from "./pages/tenant/TenantLayout";
import TenantHome from "./pages/tenant/TenantHome";
import TenantApplications from "./pages/tenant/TenantApplications";
import TenantAgreement from "./pages/tenant/TenantAgreement";
import TenantPayments from "./pages/tenant/TenantPayments";
import TenantMaintenance from "./pages/tenant/TenantMaintenance";

import OwnerLayout from "./pages/owner/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProperties from "./pages/owner/OwnerProperties";
import OwnerUnits from "./pages/owner/OwnerUnits";
import OwnerApplications from "./pages/owner/OwnerApplications";
import OwnerAgreements from "./pages/owner/OwnerAgreements";
import OwnerPayments from "./pages/owner/OwnerPayments";
import OwnerMaintenance from "./pages/owner/OwnerMaintenance";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminUnits from "./pages/admin/AdminUnits";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/properties/:propertyId" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Tenant */}
          <Route
            path="/tenant"
            element={
              <ProtectedRoute roles={["TENANT"]}>
                <TenantLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TenantHome />} />
            <Route path="applications" element={<TenantApplications />} />
            <Route path="agreement" element={<TenantAgreement />} />
            <Route path="payments" element={<TenantPayments />} />
            <Route path="maintenance" element={<TenantMaintenance />} />
          </Route>

          {/* Owner */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute roles={["OWNER"]}>
                <OwnerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OwnerDashboard />} />
            <Route path="properties" element={<OwnerProperties />} />
            <Route path="units" element={<OwnerUnits />} />
            <Route path="applications" element={<OwnerApplications />} />
            <Route path="agreements" element={<OwnerAgreements />} />
            <Route path="payments" element={<OwnerPayments />} />
            <Route path="maintenance" element={<OwnerMaintenance />} />
          </Route>

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="units" element={<AdminUnits />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
