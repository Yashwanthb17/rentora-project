// Decodes a JWT's payload without verifying the signature — fine here
// because we only use it to read non-sensitive claims (role, userId,
// expiry) for UI routing; the backend is what actually enforces auth.
export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(claims) {
  if (!claims?.exp) return true;
  return Date.now() >= claims.exp * 1000;
}
