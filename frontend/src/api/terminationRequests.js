import client from "./client";

// TENANT
export const createTerminationRequest = (agreementId, reason) =>
  client.post("/termination-requests", { agreementId, reason }).then((r) => r.data);
export const getMyTerminationRequests = () =>
  client.get("/termination-requests/my").then((r) => r.data);

// OWNER / ADMIN
export const getTerminationRequestsByAgreement = (agreementId) =>
  client.get(`/termination-requests/agreement/${agreementId}`).then((r) => r.data);
export const approveTerminationRequest = (id) =>
  client.put(`/termination-requests/${id}/approve`).then((r) => r.data);
export const rejectTerminationRequest = (id) =>
  client.put(`/termination-requests/${id}/reject`).then((r) => r.data);

// Shared
export const getTerminationRequestById = (id) =>
  client.get(`/termination-requests/${id}`).then((r) => r.data);
