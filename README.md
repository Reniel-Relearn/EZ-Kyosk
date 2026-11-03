# EZ Kyosk

EZ Kyosk is a portrait-first automated self-ordering kiosk for food and beverage establishments. The first working prototype is available on the `prototype/phase-2` branch for project-owner review. It has not been merged into `main`.

## V1 scope

V1 will provide category browsing, menu presentation, cart management, deterministic PHP price calculation, an order-review step, and simulated confirmation using mock data. It will not connect to a backend, database, POS, printer, payment provider, authentication service, or live order-management system.

See [requirements](docs/requirements.md), [architecture](docs/architecture.md), and [roadmap](docs/roadmap.md) for the project baseline.

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
npm test           Run Vitest unit tests
npm run test:watch Run Vitest in watch mode
npm run test:e2e   Run Playwright tests
```

Playwright's Chromium browser binary should be installed when browser tests are introduced in Phase 2:

```powershell
npx.cmd playwright install chromium
```

## Project status

The approved prototype has completed Phase 3 validation and Phase 4 integration preparation. It remains isolated on `prototype/phase-2` pending explicit approval to merge into `main`. See [prototype notes](docs/prototype.md) and the [Phase 4 review](docs/phase-4-review.md) for verification evidence and known limitations.

