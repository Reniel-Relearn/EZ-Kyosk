# B1T1 Takeaway Coffee Proposal Presentation

## Purpose

This edition of the EZ Kyosk interface is a presentation-only kiosk proposal for B1T1 Takeaway Coffee. It demonstrates the customer ordering experience without transmitting an order or taking payment.

## Authorized catalog

- Source reviewed: [B1T1 Takeaway Coffee menu](https://www.b1t1takeawaycoffee.com/menu)
- Catalog snapshot: 36 products across Espresso, Matcha, Chocolate, Frappe, Fruit Tea, Mini Donuts, and Waffles
- Drink pricing: explicit Solo and Buy 1 Take 1 choices
- Images: 36 product images and the active B1T1 Takeaway Coffee wordmark stored locally for reliable kiosk presentation
- Usage: included with the project owner's confirmed permission for this proposal presentation

The local catalog is intentionally separated from components in `src/data/menu.js`. Product and variant identifiers remain stable so a future managed catalog or POS adapter can replace the static source without rewriting the cart UI.

## Presentation limitations

- Confirmation is simulated locally.
- No payment is requested or processed.
- No order is sent to B1T1, a POS, a printer, or an order-management service.
- Catalog changes on the official website are not synchronized automatically.
- Availability, store-specific pricing, modifiers, and stock status are outside this proposal scope.

## Verification baseline

- Vitest validates the 36-product catalog, variant structure, centavo pricing, cart behavior, and order serialization.
- Playwright validates the complete presentation flow, category/search behavior, five-item cart scrolling, fullscreen control, narrow layout, and portrait overflow.
- Vite produces the GitHub Pages deployment bundle with all product images included.
