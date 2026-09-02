# Rentora — Rental Property Management Platform

A full-stack platform for managing rental properties, connecting tenants, owners, and admins.

## Tech Stack

- **Backend:** Java 21, Spring Boot 4.0.1, Spring Security (JWT), PostgreSQL
- **Frontend:** React 18, Vite, Tailwind CSS
- **API:** RESTful with Swagger/OpenAPI documentation

## Quick Start

### Prerequisites
- Java 21 + Maven
- Node.js 18+
- PostgreSQL

### Backend Setup
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## Project Structure
rentora/
├── backend/ # Spring Boot REST API
│ ├── src/main/java/com/rental/rentalmanagement/
│ │ ├── controller/ # REST endpoints
│ │ ├── service/ # Business logic
│ │ ├── entity/ # JPA entities
│ │ ├── security/ # JWT & authorization
│ │ └── config/ # Spring config (CORS, etc.)
│ └── pom.xml
└── frontend/ # React + Tailwind
├── src/
│ ├── pages/ # Tenant/Owner/Admin dashboards
│ ├── api/ # Axios client & API calls
│ ├── context/ # AuthContext (JWT state)
│ └── components/ # Reusable UI
├── public/hero-neighborhood.jpg
└── package.json


## Key Features

- **Public Property Discovery:** Browse available rental units
- **Tenant Portal:** Apply for units, view rental agreements, pay rent, request maintenance
- **Owner Dashboard:** Manage properties & units, review applications, approve/reject termination requests, track payments
- **Admin Console:** System-wide visibility into users, properties, and payments
- **Payment Tracking:** Automated overdue flagging
- **Maintenance Workflow:** Tenant requests → Owner actions → Resolution tracking
- **API Documentation:** Swagger UI at `/swagger-ui/index.html`

## API Endpoints

All endpoints documented in Swagger. Key flows:

### Authentication
- `POST /api/auth/login` — Login, returns JWT token
- `POST /api/users` — Register as Tenant or Owner
- `GET /api/users/me` — Get current user

### Tenant Workflows
- `GET /api/properties` — Browse available properties (public)
- `POST /api/applications` — Apply for a unit
- `GET /api/agreements/my` — View rental agreements
- `PUT /api/agreements/{id}/terminate` — Request termination
- `GET /api/payments/my` — View payment history
- `PUT /api/payments/{id}/pay` — Pay rent

### Owner Workflows
- `POST /api/properties` — Create a property
- `POST /api/units?propertyId=X` — Add a unit
- `GET /api/applications/unit/{id}` — View applications for a unit
- `PUT /api/applications/{id}/approve` — Approve & create agreement
- `PUT /api/termination-requests/{id}/approve` — Approve tenant termination
- `GET /api/maintenance/unit/{id}` — View maintenance requests
- `PUT /api/maintenance/{id}/start` — Start maintenance work

### Admin
- `GET /api/users` — All users (admin only)
- `GET /api/properties` — All properties
- `GET /api/units` — All units

## Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE rental_management;"
```

Hibernate will auto-create tables on first run (`ddl-auto=update`).

## Environment Variables

Backend uses these (optional, defaults provided in `application.properties`):

```bash
export DB_URL=jdbc:postgresql://localhost:5432/rental_management
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
```

## Testing the Application

1. **Register as Tenant** at `/register`
2. **Register as Owner** (in another browser session)
3. **Owner:** Create a property and add units
4. **Tenant:** Go to `/properties`, view details, click "Apply for this Unit"
5. **Owner:** Go to Owner Dashboard → Applications, approve the application
6. **Tenant:** Check Agreement tab, make a payment, request maintenance
7. **Owner:** Handle the maintenance request (Start → Resolve)

To test as **Admin**: Update your user role directly in the database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## Future Enhancements

- Real-time notifications (WebSockets)
- Payment gateway integration (Razorpay/Stripe)
- Document uploads (lease PDFs, ID verification)
- Owner-scoped aggregate endpoints
- Advanced search and filtering
- Email notifications for key events
