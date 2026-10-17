# LandGuard BD

LandGuard BD is a synthetic-data prototype for a Bangladesh-focused,
one-stop land paperwork verification platform. It helps a buyer check whether
a parcel's deed is recorded, mutation or khatian paperwork is still updating,
tax paperwork is reviewed, and another sale-related process is active before
they pay or purchase.

## Chosen problem statements

- **P3 — Fraud & Double-Selling Detection:** warn when land is already sold or
  sale-related paperwork is still ongoing.
- **P5 — Citizen Pre-Purchase Verification:** provide one source-by-source
  view of deed, mutation, khatian, tax, and notice signals without exposing
  personal identity or financial details.

## Demo features

1. Search the four synthetic parcels from `/verify`.
2. Compare a clear parcel with an already-sold / paperwork-update-risk scenario.
3. In User mode, submit a paperwork review request for a parcel.
4. Switch to Admin mode to approve or reject pending review requests.
5. Create a purchase intent from `/transfers`.
6. Confirm buyer and seller separately with the demo OTP `123456`.
7. Veto an active intent with OTP and view the SHA-256 audit hash.
8. Review synthetic tax receipt metadata from `/admin`.

The transfer page intentionally uses the in-memory synthetic demo store so the
live presentation works without a database seed. The production-shaped Prisma
API remains available at `/api/transfers` for the persistence-backed workflow.
The persistence API requires the `x-transfer-api-key` header matching
`TRANSFER_API_KEY`; it is intended for an authenticated backend integration,
not direct browser use. The admin demo route requires `DEMO_ADMIN_KEY` and
fails closed in production if the default demo credential is used.

## Local setup

Requirements: Node.js 22+, PostgreSQL 16+, and Redis 7+.

```bash
npm install
copy .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open <http://localhost:3000>.

For the local demo, the admin page uses the development-only
`landguard-demo-admin` fallback. The synthetic demo transfer API is disabled
when `NODE_ENV=production`.

For Docker:

```bash
docker compose up --build
```

The Compose stack supplies PostgreSQL and Redis and runs Prisma schema
deployment before starting the standalone Next.js server.

## Data and privacy

All records in `data/mock-government.json` are synthetic demo records created
for this prototype. No government portal is scraped or queried. No real
person's name, NID, phone number, address, or land record should be added to
this repository or used in a demonstration.

The public verification response deliberately omits NIDs, phone numbers, tax
amounts, and other sensitive identity/financial fields. The khas/acquisition
field is explicitly labelled as synthetic and should be replaced by an
authorized government data source in a production integration.

## Architecture

- Next.js App Router provides the citizen, transfer, and admin screens.
- Zod validates API inputs.
- `data/mock-government.json` models source systems for the offline demo.
- `lib/mock-gov-apis.ts` merges deed, mutation, tax, notice, and court signals.
- Prisma/PostgreSQL models persistent users, parcels, deeds, tax reviews, and
  transfer notices.
- Redis stores short-lived OTPs for the persistence-backed transfer API.
- SHA-256 hashes provide tamper-evident audit identifiers for demo events.

This prototype is not an official government record and is not suitable for
real transactions without authenticated government integrations, access
control, audit retention, rate limiting, and independent security review.

## AI disclosure

AI coding assistance was used to inspect the repository, identify gaps against
the supplied rulebook, implement focused UI/API fixes, and review build
configuration. The student team remains responsible for understanding,
testing, and presenting every part of the submitted code.

## Suggested five-minute demo

1. Open the clear Dhaka scenario and show synchronized deed, mutation, and tax.
2. Open the Chattogram scenario and show mutation lag, court case, and active
   notice risk.
3. Create a transfer intent for `D-1042 / K-7781`.
4. Confirm buyer and seller using `123456`, then show `APPROVED` and its audit
   hash.
5. Create another intent on a fresh parcel and demonstrate invalid OTP rejection
   followed by a valid veto.
6. Close with the synthetic-data and privacy boundary.
