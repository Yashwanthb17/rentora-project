import client from "./client";

// Public
export const getAllUnits = () => client.get("/units").then((r) => r.data);
export const getUnitById = (id) => client.get(`/units/${id}`).then((r) => r.data);

// OWNER / ADMIN
// propertyId is sent as a query param (matches the backend controller signature)
export const createUnit = (propertyId, payload) =>
  client.post(`/units?propertyId=${propertyId}`, payload).then((r) => r.data);
export const updateUnit = (id, payload) => client.put(`/units/${id}`, payload).then((r) => r.data);
export const deleteUnit = (id) => client.delete(`/units/${id}`).then((r) => r.data);
