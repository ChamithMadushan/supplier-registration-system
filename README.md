# Supplier Registration System

A full-stack supplier registration and management platform with a supplier-facing portal and an admin-side backend for processing registrations.

![Stack](https://img.shields.io/badge/Node-22-green) ![DB](https://img.shields.io/badge/SQLite-node%3Asqlite-blue) ![Frontend](https://img.shields.io/badge/React-Vite-purple)

## Features

### Supplier portal (`supplier-portal/`)
- Landing page, registration flow (6 steps) and login with 2FA
- Application tracking dashboard with live status steps
- Company profile editing (basic info, contact, directors & signatories)
- Logo upload with preview
- Document upload & management
- Notifications (type-coded, unread tracking, mark-all-read)
- Support tickets
- Live search across applications, documents, notifications and tickets
- Live sidebar & top navigation wired to the authenticated session

### Admin system (`server-admin/` + `supplier-portal/src/pages/admin`)
- Admin login with OTP (email masked on the 2FA screen)
- Dashboard with live stats
- Applications management (12 status tabs, assignment, priority)
- Suppliers, documents (7 tabs), tickets (5 tabs)
- Notifications, audit logs, blacklist, performance reviews, reports, communications, settings

### Backends
| Service | Path | Port | Description |
|---|---|---|---|
| Supplier backend | `server/` | 4000 | Auth, application, company, documents, notifications, tickets, search, uploads |
| Admin backend | `server-admin/` | 4001 | Admin auth, dashboard, applications, suppliers, documents, tickets, audit, blacklist, performance, reports, communications, settings |

Both servers share a single SQLite database (`server/data/supplier.db`). The admin backend layers its admin tables onto the supplier schema idempotently (no changes to supplier code). All API responses are camelCased by middleware.

## Tech Stack
- **Node.js 22** with built-in `node:sqlite` (`DatabaseSync`)
- **Express** REST APIs
- **SQLite** (WAL mode, foreign keys)
- **React + Vite + Tailwind** frontend
- **bcryptjs**, **jsonwebtoken**, **cors**, **dotenv**, **multer** (uploads)

## Getting Started

### Prerequisites
- Node.js **22+** (uses the built-in `node:sqlite` module)
- npm

### 1. Install dependencies
```bash
cd server && npm install
cd ../server-admin && npm install
cd ../supplier-portal && npm install
```

### 2. Configure environment
```bash
cd server
Copy-Item .env.example .env   # Windows
# or: cp .env.example .env     # macOS / Linux
```
Repeat for `server-admin/.env.example`.

### 3. Seed the database
```bash
cd server
npm run reset && npm run seed
cd ../server-admin
npm run seed
```

### 4. Start the services
```bash
cd server         && npm start   # supplier API   → http://localhost:4000
cd ../server-admin && npm start   # admin API     → http://localhost:4001
cd ../supplier-portal && npm run dev  # frontend    → http://localhost:5173
```

## Demo Credentials

| Role | Email | Password | OTP |
|---|---|---|---|
| Admin | `admin@company.lk` | `admin123` | `482000` |
| Supplier | `demo@company.lk` | `Demo@1234` | — |
| Supplier | `nadeeka@techworks.lk` | `Demo@1234` | — |
| Supplier | `ruwan@greencart.lk` | `Demo@1234` | — |

## Tests

```bash
cd server && npm test          # supplier regression (22 checks)
cd ../server-admin && npm test # admin API (49 checks)
```

Both suites share the database safely: the admin suite targets its own seeded rows to avoid mutating supplier demo data.

## Project Structure

```
├── server/            # Supplier backend (Express, port 4000)
│   ├── src/           # routes, middleware, db, seed, schema
│   ├── test/          # API regression tests
│   ├── data/          # SQLite database (gitignored)
│   └── uploads/       # uploaded files (gitignored)
├── server-admin/      # Admin backend (Express, port 4001)
│   ├── src/           # routes, middleware, db, seed, admin schema
│   └── test/          # Admin API tests
├── supplier-portal/   # React + Vite frontend (port 5173)
│   └── src/
│       ├── api/       # supplier + admin API clients
│       ├── pages/     # landing, registration, portal, admin pages
│       ├── components/ # ui, portal, admin, landing components
│       └── context/   # AuthContext
└── DOCS/              # project documents
```

## API Overview

- `POST /api/auth/login` — supplier login (email + password)
- `POST /api/auth/verify-otp` — 2FA verification
- `PUT /api/company/basic` — update company basic info
- `PUT /api/company/signatories` — update directors & signatories
- `POST /api/company/logo` — upload company logo
- `GET /api/search?q=` — global search for the logged-in user
- `POST /api/admin/auth/login` — admin login (email + password)
- `POST /api/admin/auth/verify-otp` — admin 2FA verification
- `GET /api/admin/dashboard/stats` — admin dashboard statistics

## License

Private project.
