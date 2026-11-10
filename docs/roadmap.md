# EZ Kyosk Development Roadmap

## Phase 1 — Understanding and initialization

Status: complete. The foundation was initialized and its verification commands passed.

- Inspect the workspace, Git state, design reference, and development toolchain.
- Establish the React/Vite project foundation.
- Initialize Git safely on `main` without a remote or commit.
- Add Vitest and Playwright tooling without installing browser binaries yet.
- Record the V1 requirements, architecture boundaries, and phased delivery plan.

Gate: stop and wait for **Proceed with prototyping.**

## Phase 2 — UI prototyping

Status: complete. The project owner reviewed and approved the prototype, which was integrated into `main`.

- Preserve the Phase 1 baseline, then work in an isolated prototype branch.
- Establish design tokens from the approved ivory/espresso/gold direction.
- Add separated mock catalog data.
- Build the category navigation, product browser, persistent/adaptive cart, review step, and simulated confirmation.
- Implement reducer-driven cart state and pure centavo pricing functions.
- Prioritize the 1080 × 1920 portrait viewport and validate narrower layouts.
- Provide exact local preview instructions.

Gate: project-owner visual and interaction review; the first prototype is not final.

## Phase 3 — Testing and revision

Status: complete. Project-owner initial review passed; expanded unit, browser-flow, and responsive validation is green.

- Add focused Vitest coverage for cart, money, and order logic.
- Add Playwright coverage for critical ordering flows and responsive UI behavior.
- Apply targeted review feedback without unrelated redesigns.
- Repeat verification and visual review until approved.

Gate: explicit prototype approval.

## Phase 4 — Approval and baseline integration

Status: complete. The approved prototype was merged into `main` and the full verification matrix passed on the merged branch.

- Review and refactor the approved prototype where needed.
- Confirm modular boundaries and test results.
- Recheck portrait and narrow-screen behavior.
- Explain the exact integration change set and remaining limitations.

Gate: explicit approval before merging into `main`.

## Phase 5 — Future integrations

Status: blocked on future human requirements and vendor selections; intentionally outside V1.

Treat POS, payments, receipt printing, kitchen printing, persistent menu management, order tracking, and administration as separately scoped projects. Each requires its own requirements, architecture, security review, implementation plan, and tests.

## Testing hardening follow-up

- Completed: removed Vitest's `--passWithNoTests` and Playwright's `--pass-with-no-tests` flags so CI fails if no tests are discovered.
- Implemented: Playwright builds the production site and tests that artifact through Vite preview, including the `/EZ-Kyosk/` base path. CI deploys the same tested artifact.
- Optional engineering follow-up: add meaningful coverage thresholds for domain logic.

## QR tracking presentation

Implemented: QR confirmation, a mobile page carrying the actual selected order, and automatic simulated progress. The default first-in-line timeline lasts 30 seconds; an optional three-order sample queue lasts 60 seconds. See [QR tracking notes](qr-tracking.md). Real shared queues and staff/POS updates remain separately scoped future integrations.

## Presentation image performance

Implemented: compact and large WebP product images, a resized lossless logo, eager loading for the first six products, responsive image selection, static loading placeholders, and failed-photo fallbacks. Original assets are retained as conversion sources. See [performance notes](performance.md).

## Presentation acceptance still requiring hardware

- Validate cold loading, fullscreen, touch scrolling, and QR scanning on the actual SUNMI device and a phone.
- An automatic abandoned-cart reset is an optional behavior change, not an implemented requirement; its timing and warning need project-owner selection before implementation.
- A browser test pass does not certify the hardware or convert simulated tracking into a live shared queue.

