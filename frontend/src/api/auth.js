import client from "./client";

// POST /api/auth/login -> { token }
export const login = (email, password) =>
  client.post("/auth/login", { email, password }).then((r) => r.data);

// POST /api/users (public registration)
// role must be one of "TENANT" | "OWNER" (ADMIN accounts aren't self-serve)
export const register = ({ name, email, password, phone, role }) =>
  client.post("/users", { name, email, password, phone, role }).then((r) => r.data);

// GET /api/users/me -> current user's profile
export const getCurrentUser = () => client.get("/users/me").then((r) => r.data);

// ADMIN only
export const getAllUsers = () => client.get("/users").then((r) => r.data);
export const getUserById = (id) => client.get(`/users/${id}`).then((r) => r.data);
