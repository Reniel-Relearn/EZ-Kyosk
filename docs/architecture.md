# EZ Kyosk Architecture

## Guiding approach

The V1 frontend will stay deliberately small: React components present the kiosk, a reducer owns cart transitions, pure domain functions validate and calculate orders, and catalog data remains outside components. External integration concepts are documented as boundaries, not implemented as frameworks.

## Planned source layout

Only the foundation files exist in Phase 1. The following structure is the target for Phase 2 and should be introduced incrementally as features require it:

```text
src/
├── app/                  App composition and providers
├── components/           Reusable presentation and interaction components
│   ├── category-nav/
│   ├── product-catalog/
│   ├── cart/
│   └── checkout/
├── context/              Cart context and reducer wiring
├── data/                 Mock catalog data
├── domain/
│   ├── cart/             Cart invariants and transitions
│   ├── money/            Centavo calculations and PHP formatting
│   └── order/            Reusable order structures
├── services/             V1 simulated order boundary; future adapters stay here
├── styles/               Global tokens and shared responsive styles
└── main.jsx              Application entry point

e2e/                      Playwright user-flow tests
docs/                     Requirements, architecture, roadmap, and design source
```

Folders should not be created until they hold real code.

## Responsibility boundaries

### UI components

- Receive data and callbacks through props or focused context hooks.
- Render visible state and capture user intent.
- Do not calculate totals, mutate catalog records, or call future external systems directly.

### Cart state

- Use a reducer with explicit actions such as add, increment, decrement, remove, and clear.
- Treat product identity and unit price as validated inputs.
- Enforce quantities as positive integers for stored lines.
- Derive totals instead of storing duplicated totals in state.

### Money and order domain

- Represent prices as integer centavos.
- Keep arithmetic and validation in pure JavaScript functions.
- Format PHP values only at presentation boundaries.
- Build a reusable order snapshot for review and simulated confirmation.

### Catalog data

- Store mock products in a dedicated data module.
- Give categories and products stable identifiers.
- Keep image references, descriptions, and prices declarative.

### Service boundary

V1 needs one small order-submission contract that returns a simulated result locally. When commercial integrations are approved, implementations can sit behind focused boundaries for:

- POS order submission
- Payment authorization
- Receipt printing
- Kitchen ticket printing
- Order-management synchronization

React components should invoke application-level actions, not vendor SDKs or hardware APIs. No adapter framework, network client, credentials, or hardware abstraction is warranted in V1.

## Testing strategy

- **Vitest:** reducer transitions, cart invariants, integer-centavo calculations, formatting, and order snapshot construction.
- **Playwright:** portrait layout, category browsing, add/update/remove behavior, order review, simulated confirmation, and narrow-screen adaptation.
- **Manual visual review:** compare the prototype with the approved reference at 1080 × 1920 and representative narrower portrait viewports.

## Initial decisions

- React Context plus `useReducer` is sufficient for V1 shared cart state.
- CSS custom properties and native responsive CSS will provide design tokens and layout behavior.
- No UI kit, state library, router, data-fetching library, or backend is required for the initial flow.
- Checkout can be state-driven within the app until navigation requirements justify a router.

