import client from "./client";

// TENANT
export const createMaintenanceRequest = ({ unitId, title, description, priority }) =>
  client.post("/maintenance", { unitId, title, description, priority }).then((r) => r.data);
export const getMyMaintenanceRequests = () => client.get("/maintenance/my").then((r) => r.data);
export const cancelMaintenanceRequest = (id) =>
  client.put(`/maintenance/${id}/cancel`).then((r) => r.data);

// OWNER / ADMIN
export const getMaintenanceByUnit = (unitId) =>
  client.get(`/maintenance/unit/${unitId}`).then((r) => r.data);
export const startMaintenanceRequest = (id) =>
  client.put(`/maintenance/${id}/start`).then((r) => r.data);
export const resolveMaintenanceRequest = (id) =>
  client.put(`/maintenance/${id}/resolve`).then((r) => r.data);

// Shared
export const getMaintenanceById = (id) => client.get(`/maintenance/${id}`).then((r) => r.data);
