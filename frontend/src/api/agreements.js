import client from "./client";

// TENANT
export const getMyAgreements = () => client.get("/agreements/my").then((r) => r.data);

// OWNER / ADMIN
export const getAgreementsByUnit = (unitId) =>
  client.get(`/agreements/unit/${unitId}`).then((r) => r.data);
export const terminateAgreement = (id) =>
  client.put(`/agreements/${id}/terminate`).then((r) => r.data);

// Shared
export const getAgreementById = (id) => client.get(`/agreements/${id}`).then((r) => r.data);
