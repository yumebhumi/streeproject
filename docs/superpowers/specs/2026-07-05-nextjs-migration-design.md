# Stree — Migration to Next.js + TypeScript + pnpm

**Date:** 2026-07-05
**Status:** Approved design (pending user review of this doc)

## Goal

Migrate the full Stree project (women's safety platform) from its current
MERN split (React/Vite client + Express/MongoDB server) into a **single
Next.js 15 App Router application written in TypeScript, managed with pnpm**.
The migration is a **big-bang** port done in one effort. The home page is
ported **unchanged**; a separate home-page redesign spec is written afterward.

## Non-goals

- No home-page redesign in this migration (deferred to a follow-up spec).
- No new features. Behavior parity with the current app.
- No auth-scheme change (JWT in `localStorage` + `Authorization` header stays).
- No test framework added (verification is type-check + build + manual smoke).
- No React 19 / react-leaflet 5 upgrade (deferred).

## Decisions (confirmed with user)

| Decision | Choice |
|---|---|
| Backend scope | Full stack in Next.js — Express replaced by route handlers |
| Sequencing | Full migration at once |
| Home page | Keep as-is during migration; redesign spec written after |
| React version | **Pin React 18** — keep react-leaflet 4, no map rewrite |
| TypeScript | **strict: true, pragmatic** — honest types, `any` tolerated at edges |
| Package manager | pnpm |

## Target stack & versions

- **Next.js 15** (App Router), **React 18** (pinned), **TypeScript strict**.
- Carried over at current majors: **Mongoose 8**, **zod**, **bcryptjs**,
  **jsonwebtoken**, **Tailwind CSS 3**, **Leaflet 1.9 / react-leaflet 4**,
  **react-icons**.
- **Dropped:** Recoil (installed but unused), Vite, Express, body-parser, cors,
  multer (unused), dotenv (Next loads `.env` natively), axios if unused after
  port (prefer `fetch`, matching existing code).
- All API route handlers run on the Node.js runtime
  (`export const runtime = 'nodejs'`) because they use Mongoose/bcrypt/jwt.

## Repo structure

The repo root becomes the Next.js app. `client/` and `server/` are deleted
after their contents are ported.

```
stree/
  app/
    layout.tsx              # root layout: <html>, AuthProvider, globals.css
    globals.css             # consolidated Tailwind + ported per-page CSS
    (site)/                 # route group WITH Header + Footer
      layout.tsx            # renders <Header/> {children} <Footer/>
      page.tsx              # Home (ported MainContent, UNCHANGED)
      resources/page.tsx
      helpline/page.tsx
      forum/page.tsx
      about-us/page.tsx
      contact-us/page.tsx
      map/page.tsx
      incident-form/page.tsx
      user-profile/page.tsx
      logout/page.tsx
      admin/
        layout.tsx          # ported admin-layouts.jsx (sidebar/shell)
        incidents/page.tsx
        incidents/[id]/edit/page.tsx
        users/page.tsx
        users/[id]/edit/page.tsx
        contacts/page.tsx
        contacts/[id]/edit/page.tsx
    (auth)/                 # route group WITHOUT Header + Footer
      login/page.tsx
      register/page.tsx
    api/
      auth/login/route.ts        # POST
      auth/register/route.ts     # POST
      auth/getUser/route.ts      # GET  (protected)
      incidents/getAllIncidents/route.ts   # GET (protected)
      incidents/addIncident/route.ts       # POST (protected)
      users/route.ts                       # GET  getHello
      users/createUser/route.ts            # POST
      users/incidents/route.ts             # GET (protected)
      users/incidents/[id]/route.ts        # PATCH, DELETE (protected)
      contact/contactData/route.ts         # POST
      admin/users/route.ts                 # getAllUsers (protected+admin)
      admin/users/[id]/route.ts            # get/update/delete user
      admin/incidents/route.ts             # getAllIncidents
      admin/incidents/[id]/route.ts        # get/update/delete incident
      admin/contacts/route.ts              # getAllContactMessages
      admin/contacts/[id]/route.ts         # get/update/delete message
  components/
    Header.tsx  Footer.tsx  Loading.tsx  MainContent.tsx
    auth/ (AuthInput, FormHeading, FormSubmit, BottomWarning,
           LoginForm, RegisterForm, LogoutForm)
  lib/
    db.ts          # hot-reload-safe mongoose connection cache
    auth.ts        # getAuthUser(req) + requireAdmin(user) helpers
    validators.ts  # zod login/register schemas (shared)
    api.ts         # optional small fetch helper + base URL
  models/
    user.ts  incident.ts  contact.ts   # typed mongoose models
  store/
    auth.tsx       # AuthContext provider (client), ported
  public/          # existing images (mainimg.png, etc.)
  package.json  tsconfig.json  next.config.ts
  tailwind.config.ts  postcss.config.js  .env.example
```

> Note: URL path shapes differ slightly from Express nesting where App Router
> conventions require it (e.g. `admin/users/[id]/route.ts` serves get/update/
> delete for one user). Client calls are updated to match. Where practical the
> original paths (`/api/incidents/getAllIncidents`) are preserved verbatim.

## Backend port

### Database — `lib/db.ts`
Standard Next.js singleton pattern: cache the mongoose connection on
`globalThis` so hot reload in dev doesn't open a new connection each time.
`connectDB()` is awaited at the top of every route handler.

### Models — `models/*.ts`
Port each schema to TS with a typed document interface and the
`models.X || model('X', schema)` guard (prevents "OverwriteModelError" on hot
reload).
- **User**: keep `pre('save')` bcrypt hash and `generateToken()` instance
  method. Type the method on the interface.
- **Incident**: keep GeoJSON `Point` location, `2dsphere` index, category enum,
  status enum (`submitted`/`published`/`rejected`), timestamps.
- **Contact**: userName/email/message.

### Auth — `lib/auth.ts`
Replace the two Express middlewares with helpers used inside handlers:
- `getAuthUser(req): Promise<UserDoc>` — reads `Authorization` header, verifies
  JWT with `JWT_SECRET_KEY`, loads the user (minus password). Throws an
  `HttpError(401)` on failure.
- `requireAdmin(user)` — throws `HttpError(403)` if `!user.isAdmin`.
- A small `HttpError` class + a `handle()` wrapper so handlers return the same
  `{ error }` / status codes as today. Preserves the existing error shapes
  (`{ error }`, `{ msg }`, `{ Message }`) per endpoint to avoid breaking the
  client.

### Route handlers — `app/api/**/route.ts`
Each handler mirrors the corresponding Express controller function 1:1:
parse body (zod where the Express code validated), call the same Mongoose
queries, return the same JSON + status. `export const runtime = 'nodejs'`.

## Frontend port

### Routing & layouts
- React Router `<Routes>` → file-based routes per the tree above.
- The `noHeaderFooterRoutes` (`/login`, `/register`) hide logic becomes route
  groups: `(auth)` has no Header/Footer, `(site)` renders both in its layout.
- `React.lazy` + `<Suspense>` → Next's built-in per-route code splitting;
  `Loading.tsx` reused via `loading.tsx` where useful.
- Admin nested routes → `app/(site)/admin/layout.tsx` + child pages, replacing
  the React Router `<Outlet>` in `admin-layouts.jsx`.

### Client vs server components
- Pages using hooks, `localStorage`, Leaflet, or event handlers get
  `'use client'`. Most interactive pages are client components (parity with
  current SPA behavior). Static content pages can stay server components.
- `AuthContext` provider (`store/auth.tsx`) is a client component mounted in
  the root layout so `useAuth()` works everywhere as today. `useEffect`
  auth-check on mount is preserved.

### Leaflet
`Map` and `IncidentForm` map widgets are loaded with
`next/dynamic(() => import(...), { ssr: false })` so Leaflet never runs during
SSR. `leaflet/dist/leaflet.css` imported in those client components. Existing
CDN marker-icon workaround kept.

### API access
- `import.meta.env.VITE_BACKEND_URL` → `process.env.NEXT_PUBLIC_BACKEND_URL`,
  defaulting to `""` (same-origin relative fetch). `.env.example` updated.
- Fetch calls otherwise unchanged (same paths, same `Authorization` header).

### CSS
The per-page `.css` files are consolidated into `app/globals.css` (Next only
allows global CSS import from the root layout; arbitrary component-level global
`.css` imports are disallowed). Class names are already page-scoped, so a merge
is safe. Tailwind directives live at the top of `globals.css`; `tailwind.config`
and `postcss.config` port over with the `content` globs updated to
`./app/**` and `./components/**`.

## Home page (this migration)

`components/MainContent.tsx` ported verbatim (typing effect, pink hero, four
descending CTA buttons, right-side `mainimg.png`) and rendered by
`app/(site)/page.tsx`. `react-router` `<Link>` → `next/link`. No visual change.

## Home-page redesign (deferred)

After the migrated app type-checks, builds, and passes the smoke test, write
`docs/superpowers/specs/2026-07-05-home-redesign.md` proposing a redesigned
home page (concept direction to be chosen by the user at that time). No redesign
code is written in this migration.

## What changes for consumers

- Repo now runs with `pnpm install && pnpm dev` (one app, port 3000) instead of
  two separate client/server processes.
- One `.env`: `MONGO_URI`, `JWT_SECRET_KEY`, `NEXT_PUBLIC_BACKEND_URL` (optional,
  defaults to same-origin).
- README updated to the new single-app setup.

## Verification

No automated tests exist. Verify with:
1. `pnpm tsc --noEmit` — no type errors.
2. `pnpm build` — production build succeeds.
3. Manual smoke (dev server + a test MongoDB):
   - Register a user, log in, confirm token stored and `getUser` works.
   - Submit an incident (with map pin) → lands as `submitted`.
   - Admin logs in → sees incident, publishes it → appears on `/map`.
   - Contact form submits; message visible in admin contacts.
   - Header/Footer hidden on `/login` + `/register`, shown elsewhere.
   - 404 route renders NotFound.

## Risks

- **Mongoose + Next hot reload**: mitigated by the connection cache + model
  guard patterns.
- **Leaflet SSR**: mitigated by `ssr: false` dynamic import.
- **Error-shape drift**: several controllers reference an undefined `next` in
  `catch` blocks (latent bug in the current server). During the port these
  become explicit error responses via `HttpError`/`handle()`; net behavior is
  equal or better, but noted so reviewers expect the small difference.
- **CSS consolidation**: a class-name collision across merged files could
  cross-style. Checked during smoke; namespaced if found.
```
