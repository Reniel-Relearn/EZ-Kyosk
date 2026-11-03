# EZ Kyosk Development Roadmap

## Phase 1 — Understanding and initialization

Status: complete when the recorded verification commands pass.

- Inspect the workspace, Git state, design reference, and development toolchain.
- Establish the React/Vite project foundation.
- Initialize Git safely on `main` without a remote or commit.
- Add Vitest and Playwright tooling without installing browser binaries yet.
- Record the V1 requirements, architecture boundaries, and phased delivery plan.

Gate: stop and wait for **Proceed with prototyping.**

## Phase 2 — UI prototyping

Status: first working prototype complete on `prototype/phase-2`; awaiting project-owner review.

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

Status: implementation review and integration preparation complete. Final merge into `main` is waiting for explicit project-owner approval.

- Review and refactor the approved prototype where needed.
- Confirm modular boundaries and test results.
- Recheck portrait and narrow-screen behavior.
- Explain the exact integration change set and remaining limitations.

Gate: explicit approval before merging into `main`.

## Phase 5 — Future integrations

Status: blocked on future human requirements and vendor selections; intentionally outside V1.

Treat POS, payments, receipt printing, kitchen printing, persistent menu management, order tracking, and administration as separately scoped projects. Each requires its own requirements, architecture, security review, implementation plan, and tests.

