# Student Bazaar

Student Bazaar is a university-focused academic marketplace for students in Pakistan. It lets buyers browse approved programming projects, place orders, submit custom project requests, and access their purchased downloads. Sellers can publish projects and apply for seller status, while administrators moderate projects, requests, applications, contact messages, and team profiles.

> Student Bazaar is a project marketplace and digital portfolio platform. Projects and custom work should be used responsibly and should not be submitted as a student's own original academic work.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Roles and Permissions](#roles-and-permissions)
- [Database Scripts](#database-scripts)
- [Production Notes](#production-notes)
- [Troubleshooting](#troubleshooting)
- [Security](#security)

## Features

### Public marketplace

- Browse approved ready-made projects
- Filter projects by academic field, university, degree, semester, and difficulty
- View project details and project information
- Submit custom project requests
- View contact information and team members
- Send messages to the administration team
- Read academic-integrity and service information

### Buyer accounts

- Supabase email/password registration and login
- Profile management
- Seller application submission
- Custom request submission and tracking
- Simulated checkout and purchase history
- Signed download links for completed purchases
- Private download vault

### Seller accounts

- Apply for seller access
- Submit projects for administrator approval
- Manage seller-owned projects
- Browse open custom requests

### Administrator accounts

- Dashboard statistics
- Project moderation
- Custom-request moderation
- Seller-application review
- Contact-message management
- Contact-settings management
- Team-member management

## Technology Stack

### Frontend

- React 18
- React Router 6
- Vite 5
- Tailwind CSS 3
- Axios
- Supabase JavaScript client
- Lucide React

### Backend

- Node.js
- Express 4
- Supabase PostgreSQL
- Supabase Auth
- CORS
- Morgan
- Nodemailer
- WebSocket polyfill for Supabase Node.js support

## Architecture

The frontend communicates with the Express API over HTTP. The API validates Supabase access tokens, loads the user's profile, and enforces role-based authorization. Supabase provides authentication, PostgreSQL storage, row-level security, and signed download URLs.

```text
Browser / React
      |
      |  Bearer access token
      v
Express API (:5000)
      |
      v
Supabase Auth + PostgreSQL
```

## Project Structure

```text
student-bazaar/
├── backend/
│   ├── src/
│   │   ├── config/           # Supabase client configuration
│   │   ├── constants/        # Shared role constants
│   │   ├── controllers/      # Route and data-access logic
│   │   ├── middleware/       # Authentication and RBAC middleware
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Notifications and integrations
│   │   └── server.js         # API entry point
│   ├── supabase_schema.sql
│   ├── supabase_auth_hardening.sql
│   ├── supabase_contact_team_schema.sql
│   └── supabase_table_permissions_fix.sql
└── frontend/
    ├── src/
    │   ├── components/       # Shared UI components
    │   ├── context/          # Auth and cart context
    │   ├── data/             # Local academic filter data
    │   ├── pages/            # Public, auth, buyer, seller, and admin pages
    │   ├── routes/           # Frontend route definitions
    │   └── services/         # API and Supabase clients
    ├── index.html
    └── vite.config.js
```

## Prerequisites

- Node.js 18 or newer
- npm
- A Supabase project
- Optional: an SMTP provider for administrator decision emails

## Quick Start

From the repository root:

```bash
# Terminal 1: backend
cd student-bazaar/backend
cp .env.example .env
npm install
npm run dev

# Terminal 2: frontend
cd student-bazaar/frontend
cp .env.example .env
npm install
npm run dev
```

The frontend is available at `http://localhost:5173` and the API at `http://localhost:5000`.

Before starting the backend and frontend, configure Supabase and add the required environment variables described below.

## Environment Variables

### Backend: `backend/.env`

| Variable | Required | Description |
|---|---:|---|
| `PORT` | No | API port. Defaults to `5000`. |
| `NODE_ENV` | No | Use `development` or `production`. |
| `SUPABASE_URL` | Yes | Supabase project URL. |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon/public key. Never use the service-role key in browser or public code. |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended for admin notifications | Supabase service-role key used only by trusted server code. Keep it secret. |
| `CLIENT_URL` | Yes | Frontend origin. Multiple origins may be separated by commas. |
| `SMTP_HOST` | Optional | SMTP server hostname for decision emails. |
| `SMTP_PORT` | Optional | SMTP port. Usually `587`. |
| `SMTP_SECURE` | Optional | Set `true` for implicit TLS, otherwise `false`. |
| `SMTP_USER` | Optional | SMTP username. |
| `SMTP_PASSWORD` | Optional | SMTP password or application password. |
| `EMAIL_FROM` | Optional | Sender address used for outgoing emails. |

Example:

```dotenv
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=
CLIENT_URL=http://localhost:5173

SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=
```

### Frontend: `frontend/.env`

| Variable | Required | Description |
|---|---:|---|
| `VITE_API_URL` | Yes | Base URL of the Express API. |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key. |

Example:

```dotenv
VITE_API_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Vite variables are bundled into the browser. Only expose the anon/public Supabase key in the frontend.

## Supabase Setup

1. Create a project in [Supabase](https://supabase.com).
2. Open **Project Settings > API** and copy the project URL and anon/public key.
3. Open **SQL Editor** and run `backend/supabase_schema.sql` for a new database.
4. Run `backend/supabase_contact_team_schema.sql` to create contact and team tables.
5. If the database already uses an earlier schema, run `backend/supabase_auth_hardening.sql` instead of rerunning the full schema.
6. If moderation pages return table permission errors, run `backend/supabase_table_permissions_fix.sql`.
7. Configure email confirmation and password recovery under **Authentication > Providers > Email**.
8. Set allowed authentication redirect URLs in **Authentication > URL Configuration**.

For local development, allow:

```text
http://localhost:5173/**
http://localhost:5173/login
```

Add the deployed frontend URL for production.

### Create the first administrator

New accounts are always created with the `buyer` role. Promote the first trusted account through the Supabase SQL editor:

```sql
UPDATE public.profiles AS p
SET role = 'admin'
FROM auth.users AS u
WHERE p.id = u.id
  AND lower(u.email) = lower('admin@example.com');
```

Replace the email with the account to promote. Seller profiles are restored through the seller-application review workflow.

## Running the Application

### Development

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

### Production build

Build the frontend:

```bash
cd frontend
npm run build
```

The generated static site is written to `frontend/dist`. Deploy that directory to a SPA-capable static host.

Start the API:

```bash
cd backend
npm start
```

Set `NODE_ENV=production` and configure the deployed frontend URL in `CLIENT_URL`. CORS permits localhost origins in development and the configured origins in production.

### Health check

```bash
curl http://localhost:5000/api/v1/health
```

## API Overview

All API routes are prefixed with `/api/v1`.

| Area | Base path | Highlights |
|---|---|---|
| Authentication | `/auth` | Register, login, current profile, profile update |
| Sellers | `/sellers` | Seller applications and reviews |
| Projects | `/projects` | Public catalog, seller projects, admin moderation |
| Orders | `/orders` | Checkout, purchases, signed downloads |
| Custom requests | `/custom-requests` | Buyer requests, seller feed, admin queue |
| Admin | `/admin` | Dashboard statistics |
| Contact | `/contact` | Public messages/settings, admin management |
| Team | `/team` | Public team list, admin management |

Protected routes require:

```http
Authorization: Bearer <supabase-access-token>
```

The main public endpoints include:

```text
GET  /api/v1/health
GET  /api/v1/projects
GET  /api/v1/projects/detail/:slug
GET  /api/v1/contact/info
GET  /api/v1/team
```

Authentication and profile endpoints include:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
PUT  /api/v1/auth/update-profile
```

Protected resource endpoints include:

```text
POST /api/v1/sellers/apply
GET  /api/v1/sellers/my-application
POST /api/v1/projects
GET  /api/v1/orders/my-purchases
POST /api/v1/orders/checkout
GET  /api/v1/orders/downloads/:projectId
POST /api/v1/custom-requests
GET  /api/v1/custom-requests/my-requests
```

Administrator endpoints use the same `/api/v1` prefix and are protected by the `admin` role.

## Roles and Permissions

| Role | Access |
|---|---|
| Guest | Public catalog, project details, contact, team, and custom-request submission may follow public/auth rules |
| Buyer | Profile, seller application, custom requests, checkout, and purchases |
| Seller | Buyer access plus project publishing and open custom-request feed |
| Admin | Moderation, administration, contact management, and team management |

The backend uses JWT validation and role checks in `protect` and `restrictTo` middleware. Supabase row-level security provides an additional database authorization layer.

## Database Scripts

| Script | Purpose |
|---|---|
| `backend/supabase_schema.sql` | Creates the complete initial profile, project, order, payment, seller, and custom-request schema |
| `backend/supabase_auth_hardening.sql` | Hardens existing authentication/profile policies and restores elevated profiles to buyer |
| `backend/supabase_contact_team_schema.sql` | Creates contact-message, contact-setting, and team-member tables |
| `backend/supabase_table_permissions_fix.sql` | Adds Supabase table privileges needed for protected application queries |

Run scripts with the Supabase SQL editor. Back up the database before applying migrations to an existing project.

## Production Notes

- Configure CORS with the exact deployed frontend origin.
- Configure Supabase email redirect URLs for registration and password recovery.
- Serve the frontend through an SPA fallback so `/browse`, `/login`, and admin paths resolve to `index.html`.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Store SMTP credentials outside source control.
- Use HTTPS for both frontend and backend origins.
- Do not expose service-role operations through public Express routes.
- No built-in demo accounts are included.

## Troubleshooting

### Supabase authentication is disabled

Check the backend and frontend Supabase values. Both must contain the real project URL and anon/public key. Placeholder values are detected and disabled.

### Backend returns `503 Supabase Auth is not configured`

Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `backend/.env`, then restart the Express server.

### Frontend cannot log in

Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `frontend/.env`, then restart Vite.

### `permission denied for table ...`

Run `backend/supabase_table_permissions_fix.sql` in the Supabase SQL editor. Confirm that the relevant RLS policies and table grants exist.

The public team endpoint uses the anon Supabase client and requires public `SELECT` access to active team members. Public contact submissions use `INSERT` only; they do not request the inserted contact row, which avoids granting public read access to private messages. Restart the backend after deploying code changes.

### CORS request blocked

Set `CLIENT_URL` in `backend/.env` to the frontend origin, for example:

```dotenv
CLIENT_URL=https://student-bazaar.example.com
```

Multiple origins may be comma-separated.

### Moderation emails are not sent

SMTP settings are optional. Check `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, and `EMAIL_FROM`. Moderation decisions can still be saved without SMTP; the admin UI reports that the email was not sent.

### Registration succeeds but login cannot load a profile

Confirm `supabase_schema.sql` or `supabase_auth_hardening.sql` created the profile trigger and `public.profiles` table. Check Supabase Auth logs and database logs for trigger errors.

## Security

- Supabase Auth is responsible for password hashing and session management.
- Express validates the Supabase access token on every protected request.
- Profiles contain application-specific roles and are loaded from Supabase before RBAC checks.
- Signup metadata cannot grant elevated roles; elevated access must be assigned through trusted database administration.
- Supabase row-level security is used in addition to API authorization.
- The service-role key must never be added to Vite environment variables or committed to source control.
