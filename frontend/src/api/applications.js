import client from "./client";

// TENANT
export const createApplication = (unitId, message) =>
  client.post("/applications", { unitId, message }).then((r) => r.data);
export const getMyApplications = () => client.get("/applications/my").then((r) => r.data);

// OWNER / ADMIN
export const getApplicationsByUnit = (unitId) =>
  client.get(`/applications/unit/${unitId}`).then((r) => r.data);
export const approveApplication = (id) =>
  client.put(`/applications/${id}/approve`).then((r) => r.data);
export const rejectApplication = (id) =>
  client.put(`/applications/${id}/reject`).then((r) => r.data);

// Shared
export const getApplicationById = (id) => client.get(`/applications/${id}`).then((r) => r.data);
