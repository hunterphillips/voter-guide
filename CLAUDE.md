# Voter Guide Web App — Build Spec

This document is the **source of truth** for implementing a read-only voter guide web app. The site is static-first, fetches data from our own API (no real-time third parties), and is optimized for **speed, accessibility, and clarity**.

---

## 0) Objectives

- **Flow:** City → Upcoming Elections → Candidate Comparison.
- **No real-time lookups.** A separate job ingests data into Postgres.
- **Modern, minimal stack** with clear API contracts and testable UI states.
- **Mobile-first & accessible** (WCAG AA).

---

## 1) Tech Stack & Conventions

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS; Headless UI components where needed
- **DB:** Postgres (Prisma as ORM & migration tool)
- **API:** Next.js Route Handlers; read-only JSON
- **Cache:** Edge/CDN + SWR (stale-while-revalidate) on the client
- **Hosting:** Vercel (assume), or equivalent
- **Lint/Format/Test:** ESLint, Prettier, Vitest/Playwright

**Naming:**

- Slugs kebab-case; stable, deterministic.
- Enums UPPER_SNAKE in DB; lowerCamel in JSON payloads.

---

## 2) Project Structure

```
/app
  /(public)           # marketing or general pages (optional)
  /api
    /cities
      route.ts        # GET /api/cities?q=
    /cities/[citySlug]/elections
      route.ts        # GET /api/cities/:city/elections
    /cities/[citySlug]/elections/[electionSlug]
      route.ts        # GET /api/cities/:city/elections/:election
  /c
    /[citySlug]
      page.tsx        # City elections list
    /[citySlug]/e/[electionSlug]
      page.tsx        # Election detail (comparison table)
  /page.tsx           # Home: typeahead search

/components
  /search/CityTypeahead.tsx
  /elections/ElectionList.tsx
  /elections/KeyDatesBar.tsx
  /candidates/CandidateComparisonTable.tsx
  /shared/*

/lib
  /db.ts              # Prisma client
  /geo.ts             # geolocation helpers (reverse-nearest)
  /cache.ts           # SWR, cache headers helpers
  /slug.ts            # slug builders/parsers
  /a11y.ts            # aria helpers

/prisma
  schema.prisma
  seed.ts

/scripts
  ingest.ts           # data loader (run manually/CI)
  validate.ts         # JSON schema validation (optional)

/tests
  e2e/*               # Playwright
  unit/*              # Vitest

/public
  /images
  /icons
```

---

## 3) Environment Variables

```
DATABASE_URL=postgres://...
NEXT_PUBLIC_APP_URL=https://...
# If geolocation gating is needed:
NEXT_PUBLIC_ENABLE_GEO=true|false
```

---

## 4) Data Model (DB Schema Summary)

> Implement in Prisma. The following fields are **authoritative** (you can add metadata columns like createdAt/updatedAt).

### City

- `id` (uuid, pk)
- `name` (string)
- `state` (string, 2–4 chars)
- `county` (string, nullable)
- `lat` (float), `lng` (float) — optional
- `slug` (string, unique)
- `isActive` (bool, default true)
- **Indexes:** `(name, state)`; trigram/GIN on `name` for search if available.

### Election

- `id` (uuid, pk)
- `cityId` (fk → City)
- `title` (string)
- `shortDescription` (string)
- `electionDate` (date)
- `electionType` (enum: PRIMARY | GENERAL | SPECIAL_PRIMARY | SPECIAL_GENERAL | RUNOFF)
- `registrationDeadline` (date, nullable)
- `earlyVotingStart` (date, nullable)
- `earlyVotingEnd` (date, nullable)
- `absenteeDeadline` (date, nullable)
- `slug` (string, unique within city)
- `isActive` (bool)

### Candidate

- `id` (uuid, pk)
- `electionId` (fk → Election)
- `fullName` (string)
- `party` (enum: R | D | I | OTHER)
- `ballotName` (string, nullable)
- `incumbent` (bool, default false)
- `websiteUrl` (string, nullable)
- `photoUrl` (string, nullable)
- `residenceCity` (string, nullable)
- `occupation` (string, nullable)
- `summaryBio` (string, nullable)
- `displayOrder` (int, default 0)

### Issue

- `id` (uuid, pk)
- `slug` (string, unique)
- `name` (string) — e.g., “Economy & Taxes”
- `category` (string) — e.g., “economy”
- `displayOrder` (int)

### CandidateIssuePosition

- `id` (uuid, pk)
- `candidateId` (fk → Candidate)
- `issueId` (fk → Issue)
- `positionSummary` (text, 280–600 char target)
- `evidenceUrl` (string, nullable)
- `stance` (enum: SUPPORT | OPPOSE | MIXED | UNSPECIFIED)

### Endorsement (optional)

- `id` (uuid, pk)
- `candidateId` (fk → Candidate)
- `endorserName` (string)
- `endorserType` (enum: PERSON | ORG | MEDIA | PAC | OTHER)
- `quote` (string, nullable)
- `sourceUrl` (string, nullable)

---

## 5) API Contracts (Read-Only)

### GET `/api/cities?q={string}&state={optional}`

**Purpose:** Typeahead.  
**Response (200):**

```json
{
  "items": [
    { "id": "uuid", "name": "Nashville", "state": "TN", "slug": "nashville-tn" }
  ],
  "total": 1
}
```

### GET `/api/cities/:citySlug/elections?includePast={bool}`

**Purpose:** List elections for a city (upcoming default).  
**Response (200):**

```json
{
  "city": { "name": "Nashville", "state": "TN", "slug": "nashville-tn" },
  "items": [
    {
      "slug": "us-house-tn-7-2025-special-primary",
      "title": "U.S. House TN-7 Special Primary",
      "shortDescription": "Fills the vacant U.S. House seat...",
      "electionDate": "2025-10-07",
      "electionType": "SPECIAL_PRIMARY",
      "keyDates": {
        "registrationDeadline": "2025-09-08",
        "earlyVotingStart": "2025-09-17",
        "earlyVotingEnd": "2025-10-02",
        "absenteeDeadline": "2025-09-27"
      }
    }
  ]
}
```

### GET `/api/cities/:citySlug/elections/:electionSlug`

**Purpose:** Election details + candidates + issue grid.  
**Response (200):**

```json
{
  "election": { ... },
  "issues": [ ... ],
  "candidates": [ ... ]
}
```

---

## 6) UI Requirements

### Home (`/`)

- Typeahead search box (debounced, ARIA-compliant).
- “Use my location” (geolocation optional).
- Save recent city in `localStorage`.

### City (`/c/[citySlug]`)

- Header with city name/state.
- Upcoming elections list, toggle to show past.

### Election (`/c/[citySlug]/e/[electionSlug]`)

- Header with title/date/description.
- Key dates bar.
- Candidate comparison table:
  - Columns: Candidate | Background | Economy & Taxes | Healthcare | Education | Reproductive Rights | Public Safety/Veterans | Immigration/Border | Endorsements
  - Mobile view: stacked cards with accordions.
- Print/export stylesheet.

---

## 7) Caching Strategy

- API responses: `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`.
- Client: SWR hooks.
- Ingest job triggers revalidation (admin endpoint).

---

## 8) Data Ingestion

- Input JSON/CSV per election.
- Validate, upsert, recompute `displayOrder`.
- Trigger cache invalidation.
- Example schema included in notes above.

---

## 9) Testing Requirements

- Unit tests (API contracts).
- E2E tests with Playwright.
- Accessibility tests (axe).
- Performance budgets (LCP < 2.5s mobile).

---

## 10) Definition of Done (MVP)

- Home → City → Election flow implemented.
- APIs match contract.
- Candidate comparison table responsive + print-friendly.
- Ingest job works.
- Accessibility and smoke tests pass.

---
