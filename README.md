<a name="readme-top"></a>

<div align="center">
  <h3>Stree — Empowering Women's Safety and Growth</h3>
  <p>A women's safety platform: report incidents, view a moderated incident map, and find helplines and resources.</p>
</div>

<hr/>

## About

Stree lets people report safety incidents (optionally anonymously), pins them on
a map after admin moderation, and surfaces curated helplines and career/education
resources for women in India.

This is a single **Next.js 14 (App Router) + TypeScript** application. The UI and
the API (route handlers backed by MongoDB via Mongoose) live in one project.

### Built with

- [Next.js 14](https://nextjs.org/) (App Router) + React 18
- TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- Leaflet / react-leaflet (maps)
- JWT auth (`jsonwebtoken`) + `bcryptjs`
- Zod (validation)
- pnpm

## Getting started

### Prerequisites

- Node.js 18.18+ (or 20+)
- pnpm (`npm install -g pnpm`)
- A MongoDB instance (local or hosted)

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env
# then edit .env and set MONGO_URI and JWT_SECRET_KEY

# 3. Run the dev server
pnpm dev
```

The app runs at http://localhost:3000.

### Environment variables

| Variable                  | Required | Description                                            |
| ------------------------- | -------- | ------------------------------------------------------ |
| `MONGO_URI`               | yes      | MongoDB connection string                              |
| `JWT_SECRET_KEY`          | yes      | Secret used to sign/verify JWTs                        |
| `NEXT_PUBLIC_BACKEND_URL` | no       | API base URL. Leave empty for same-origin (default).   |

## Scripts

| Command          | Description                        |
| ---------------- | --------------------------------- |
| `pnpm dev`       | Start the development server      |
| `pnpm build`     | Production build                  |
| `pnpm start`     | Start the production server       |
| `pnpm lint`      | Run ESLint                        |
| `pnpm typecheck` | Type-check with `tsc --noEmit`    |

## Project structure

```
app/
  (site)/     Pages with the site Header + Footer (home, resources, helpline,
              forum, contact, map, incident-form, user-profile, admin, ...)
  (auth)/     Login and Register (no Header/Footer)
  api/        Route handlers (auth, incidents, users, contact, admin)
components/   Header, Footer, MainContent, auth forms
lib/          db connection, auth helpers, zod validators
models/       Mongoose models (User, Incident, Contact)
store/        AuthContext provider (client)
public/       Static images
```

## Notable API routes

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/getUser`
- `GET /api/incidents/getAllIncidents`, `POST /api/incidents/addIncident`
- `GET /api/users/incidents`, `PATCH|DELETE /api/users/incidents/:id`
- `POST /api/contact/contactData`
- Admin (JWT + admin required): `/api/admin/getAllUsers`,
  `/api/admin/getAllIncidents`, `/api/admin/updateIncident/:id`, etc.

Admin-only routes require a user whose `isAdmin` flag is `true`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
