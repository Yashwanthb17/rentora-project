import axios from "axios";

// In dev, Vite's proxy (see vite.config.js) forwards "/api" to the Spring
// Boot backend on :8080, so we can just use a relative base URL here.
const client = axios.create({
  baseURL: "/api",
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("rentora_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token missing/expired/invalid — clear it and send the user back
      // to login rather than showing a confusing broken dashboard.
      localStorage.removeItem("rentora_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;
