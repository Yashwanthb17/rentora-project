import React, { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";
import { decodeJwt, isTokenExpired } from "../api/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("rentora_token"));
  const [user, setUser] = useState(null); // { id, name, email, phone, role, active }
  const [loading, setLoading] = useState(true);

  const claims = token ? decodeJwt(token) : null;
  const role = claims?.role ?? null; // "TENANT" | "OWNER" | "ADMIN"

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!token || isTokenExpired(decodeJwt(token))) {
        localStorage.removeItem("rentora_token");
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await authApi.getCurrentUser();
        if (!cancelled) setUser(profile);
      } catch {
        if (!cancelled) {
          localStorage.removeItem("rentora_token");
          setToken(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function signIn(email, password) {
    const { token: newToken } = await authApi.login(email, password);
    localStorage.setItem("rentora_token", newToken);
    setToken(newToken);
  }

  function signOut() {
    localStorage.removeItem("rentora_token");
    setToken(null);
    setUser(null);
  }

  async function signUp({ name, email, password, phone, role }) {
    await authApi.register({ name, email, password, phone, role });
    await signIn(email, password);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, role, loading, isAuthenticated: !!token, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
