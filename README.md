# EZ Kyosk — B1T1 Proposal Demo

EZ Kyosk is a portrait-first automated self-ordering kiosk for food and beverage establishments. The current public presentation is tailored for B1T1 Takeaway Coffee using its authorized menu branding, 36-item catalog, product photography, and Solo/Buy 1 Take 1 choices.

**Live demo:** [https://reniel-relearn.github.io/EZ-Kyosk/](https://reniel-relearn.github.io/EZ-Kyosk/)

## V1 scope

V1 provides category browsing, menu presentation, cart management, deterministic PHP price calculation, an order-review step, and simulated confirmation. It does not connect to a backend, database, POS, printer, payment provider, authentication service, or live order-management system.

See [requirements](docs/requirements.md), [architecture](docs/architecture.md), and [roadmap](docs/roadmap.md) for the project baseline.

The public demo deployment process is documented in [deployment notes](docs/deployment.md).

The B1T1 presentation scope and asset provenance are documented in [B1T1 proposal notes](docs/b1t1-proposal.md).

After confirming an order, scan its QR with a phone camera to open the actual selected items and simulated progress. The default demo reaches Preparing at 5 seconds and Ready for pickup at 30 seconds from confirmation. An optional busy-queue presentation runs for 60 seconds. See [QR tracking notes](docs/qr-tracking.md) for timings, testing, and limitations.

## Local setup

Requirements:

- Node.js 22.12 or newer
- npm 11 or newer

Install and run:

```powershell
npm.cmd install
npm.cmd run dev
```

On systems where PowerShell script execution allows the npm shim, `npm` can be used in place of `npm.cmd`.

## Commands

```text
npm run dev        Start the Vite development server
npm run build      Create a production build
npm run preview    Preview the production build
npm run images:optimize Regenerate optimized menu images from the original PNGs
npm test           Run Vitest unit tests
npm run test:watch Run Vitest in watch mode
npm run test:e2e   Build production assets and run Playwright against that build
```

Install Playwright's Chromium browser binary before running the local browser suite for the first time:

```powershell
npx.cmd playwright install chromium
```

## Project status

The approved V1 prototype has completed Phase 3 validation and Phase 4 integration and is now on `main`. See [prototype notes](docs/prototype.md) and the [Phase 4 review](docs/phase-4-review.md) for verification evidence and known limitations.

