import client from "./client";

// Public
export const getAllProperties = () => client.get("/properties").then((r) => r.data);
export const getPropertyById = (id) => client.get(`/properties/${id}`).then((r) => r.data);

// OWNER / ADMIN
export const createProperty = (payload) => client.post("/properties", payload).then((r) => r.data);
export const updateProperty = (id, payload) => client.put(`/properties/${id}`, payload).then((r) => r.data);
export const deleteProperty = (id) => client.delete(`/properties/${id}`).then((r) => r.data);
