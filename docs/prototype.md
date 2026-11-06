# Phase 2 Prototype Notes

## Implemented

- Portrait-first three-region kiosk layout based on the approved design reference
- Responsive category navigation, including horizontal touch scrolling on narrow screens
- Search and price/popularity sorting
- Thirty-six B1T1 Takeaway Coffee menu products with authorized project-local imagery
- Explicit Solo and Buy 1 Take 1 drink choices stored as distinct cart lines
- Reducer-driven cart add, increment, decrement, remove, and clear behavior
- Integer-centavo price computation and PHP formatting
- Empty-cart state, order subtotal, and total
- Order-review screen and explicitly simulated confirmation
- Narrow-screen cart drawer with a persistent order action
- Keyboard focus indicators, accessible labels, reduced-motion support, and semantic landmarks

## Local preview

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173/`.

## Verification

```powershell
npm.cmd test
npm.cmd run test:e2e
npm.cmd run build
```

Playwright covers the complete simulated ordering journey, touchscreen fullscreen control, narrow-screen cart behavior, menu filtering and removal, and portrait overflow checks.

Latest Phase 3 results:

- Vitest: 5 files, 18 tests passed
- Playwright: 9 tests passed, including fullscreen toggling, food-item coverage, and five-product cart scrolling
- Responsive overflow checks: 1080 × 1920, 768 × 1024, and 430 × 900
- Vite production build: passed
- `git diff --check`: passed

## Prototype limitations

- Catalog and order state reset on refresh.
- Confirmation is local and simulated; no order is transmitted.
- Taxes, discounts, service charges, and payments are intentionally absent.
- No POS, printer, backend, or order-management integration exists.

