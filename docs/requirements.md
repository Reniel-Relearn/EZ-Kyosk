# EZ Kyosk V1 Requirements Baseline

## Product goal

EZ Kyosk is a modern self-ordering experience for restaurant, café, and quick-service touchscreen kiosks. Its primary reference viewport is 1080 × 1920 in portrait orientation, with responsive behavior for other portrait displays and narrow screens.

## V1 user journey

1. Browse menu categories.
2. View products, descriptions, images, and prices.
3. Add products to the current order.
4. Increase, decrease, or remove cart items.
5. Review line totals, subtotal, and final total.
6. Review the order before confirmation.
7. Confirm and see an explicitly simulated confirmation state.

## Required behavior

### Menu

- Use realistic mock catalog data stored separately from React components.
- Support category navigation and product discovery.
- Present all amounts in Philippine pesos.
- Provide large, touch-friendly interactive controls.

### Cart

- Centralize shared cart state using React Context and `useReducer` when the prototype needs it.
- Prevent negative quantities and invalid cart entries.
- Handle an empty order clearly.
- Keep the order summary accessible during browsing; use an adaptive alternative on narrow screens.

### Pricing

- Store monetary values as integer centavos.
- Calculate each line total as unit price × quantity.
- Derive subtotal and final total from valid cart lines.
- Keep subtotal and total equal in V1.
- Keep computation independent from UI components and cover it with unit tests.

### Checkout

- Include a distinct review step.
- Confirmation is local and simulated only.
- Never imply that payment was processed or an order reached a POS, kitchen, printer, or backend.

## Design direction

The approved reference asset is [`design/Elegant Café Kiosk Ordering Interface.png`](design/Elegant%20Caf%C3%A9%20Kiosk%20Ordering%20Interface.png). It establishes an ivory, espresso, and muted-gold palette; editorial serif display typography; restrained sans-serif supporting text; rounded cards; soft borders and shadows; and a portrait three-region composition.

The prototype should interpret that reference for real touchscreen ergonomics rather than reproduce it literally. Product accessibility, clear state feedback, readable contrast, resilient responsive behavior, and adequately sized touch targets take priority over pixel matching.

## Explicitly excluded from V1

- Backend services and databases
- Real payments or payment SDKs
- POS submission
- Receipt or kitchen printer drivers
- Order-management APIs
- Authentication and user accounts
- Taxes, discounts, service charges, and promotions
- Menu administration
- Deployment or remote repository creation

## Acceptance gates

- Product features begin only after Phase 2 authorization.
- The initial prototype is subject to visual and interaction review.
- Tests must be run before reporting their result.
- Prototype integration into `main` requires explicit approval.

