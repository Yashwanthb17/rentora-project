# Rentora — Frontend + Backend Integration

This is the React frontend wired up to your Spring Boot `rental-management` API.

## Running it

**1. Backend** (from the Spring Boot project root):

```
mvn spring-boot:run
```

It should come up on `http://localhost:8080`. Make sure Postgres is running and
`application.properties` points at it (or set `DB_URL` / `DB_USERNAME` / `DB_PASSWORD`
env vars — see the property file, they now default to your local values but can be
overridden).

**2. Frontend**:

```
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. The Vite dev server proxies every `/api/*`
request to `http://localhost:8080`, so the browser only ever talks to one
origin and you won't hit CORS issues in dev. (The backend's `SecurityConfig`
also has a CORS bean now, for when you deploy the frontend and backend on
separate origins for real.)

## What's wired up

- **Auth** — login/register hit the real `/api/auth/login` and `/api/users`
  endpoints. The JWT is stored in `localStorage`, decoded client-side for
  `role`/`userId` (routing only — the backend is what actually enforces
  authorization), and attached to every request via an axios interceptor.
- **Public** — `/` and `/properties` and `/properties/:id` call the now-public
  `GET /api/properties` and `GET /api/units` endpoints. Applying prompts login
  if you're not signed in.
- **Tenant** (`/tenant/*`) — My Home, Applications, Agreement (with the
  termination-request flow), Payments (Pay Now), Maintenance (create/cancel).
  All backed by the `/my` endpoints on each resource.
- **Owner** (`/owner/*`) — Dashboard, Properties, Units, Applications
  (approve/reject), Agreements (terminate + approve/reject tenant
  termination requests), Payments, Maintenance (start/resolve). Since the
  backend doesn't have an owner-scoped "my properties" endpoint, the frontend
  fetches everything and filters client-side by `ownerId`/`propertyId` — fine
  at this scale, but worth adding a real `/api/properties/my` endpoint if your
  catalog grows large.
- **Admin** (`/admin/*`) — Dashboard, Users, Properties, Units, all backed by
  the admin-only list endpoints.

## Backend changes made alongside this frontend

- `SecurityConfig` — added a CORS bean; opened `GET /api/properties` and
  `GET /api/units` (list + by id) to unauthenticated access for public
  browsing.
- `UserController` / `UserService` — added `GET /api/users/me`; restricted
  `GET /api/users` and `GET /api/users/{id}` to ADMIN only (previously any
  authenticated user could look up any other user by id).

## Known gaps / next steps

- No owner-scoped aggregate endpoints yet (see note above) — client-side
  filtering works but does more round trips than ideal once you have many
  properties.
- The full marketing landing page (hero image, alternating feature sections,
  etc.) from the earlier Rentora artifact isn't merged into `Landing.jsx` —
  that page here is intentionally minimal. Swap in the fuller version if you
  want the complete marketing site experience at `/`.
- No toast notifications yet — errors currently render inline as a red banner
  at the top of the page instead.
- No pagination on any of the list endpoints/pages — fine for a demo dataset,
  worth adding before this sees real traffic.
