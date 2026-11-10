# QR Tracking Presentation

## Try the presentation

1. Open https://reniel-relearn.github.io/EZ-Kyosk/ on the kiosk or a second screen.
2. Add products, review, and confirm the presentation order.
3. Scan the displayed QR with a phone camera and open the link. Alternatively, use **Open tracking preview**.
4. The phone shows the actual selected items, quantities, variants, total, and simulated progress.
5. Use **Start a new order** on the kiosk for another presentation. Previously scanned links continue working independently.

The default is **First in line**. No sample orders are put ahead of the customer. The optional **3 sample orders ahead** radio button changes the displayed QR to a busy-queue example. Select it before scanning; it changes the link, not an already-open phone page.

## Timelines

Time starts at kiosk confirmation, not at scan time. Links carry the original timestamp, so reloading or reopening does not restart progress. Both devices' clocks should be set correctly.

| Time | First in line | Busy queue |
| --- | --- | --- |
| 0–5 seconds | Received; first in line | Received; 3 sample orders ahead |
| 5–15 seconds | Preparing | Received; 3 sample orders ahead |
| 15–30 seconds | Preparing | Preparing; 2 sample orders ahead |
| 30–45 seconds | Ready for pickup | Preparing; 1 sample order ahead |
| 45–60 seconds | Ready for pickup | Preparing; no sample orders ahead |
| 60 seconds onward | Ready for pickup | Ready for pickup |

Ready remains displayed; collection is never automatically claimed. Scanning after the ready threshold opens directly at Ready.

## Static architecture and limitations

- Two interfaces: kiosk confirmation and mobile tracking. No database, shared service, or admin dashboard is used.
- The QR encodes a same-site URL such as `/EZ-Kyosk/#track=<payload>`. Hash routing works with GitHub Pages without server routing rules.
- A versioned URL-safe payload carries stable catalog source IDs, variant IDs, quantities, confirmed unit prices, demo reference, timestamp, and queue mode. It carries no name, email, or phone number.
- Item names and variant labels are reconstructed from the local catalog. The price snapshot preserves the confirmed total across price changes. Removed products or variants produce a recoverable invalid-link page.
- Anyone with the link can view or change its demo data. It is not a signed order, payment receipt, or pickup credential.
- Each link simulates its own progress. It does not count other customers, synchronize staff actions, or show a real kitchen queue.
- Different device clocks can show different stages. Future real tracking needs server timestamps and shared order storage behind an order service.
- QR generation is local using `qrcode-generator`; no third-party QR-image service receives the order link. Black-on-white modules have a four-module quiet zone and medium error correction.
- The 60-choice catalog cart is tested for decoding at its displayed kiosk size. Extremely large payloads that exceed QR capacity show a tracking-link fallback.
- Physical phone-camera scanning on the actual SUNMI display remains a project-owner hardware check.

## Verification

Run `npm test`, `npm run test:e2e`, and `npm run build`.

`src/domain/tracking.test.js` verifies encoding, variants, quantities, confirmed prices, the Pages URL path, all 60 choices, malformed payloads, duplicate lines, invalid amounts, overflow, and exact timing boundaries.

`e2e/qr-tracking.spec.js` rasterizes the displayed QR at its rendered size and decodes it using the independent test-only `jsqr` library. It opens the decoded URL in a fresh mobile browser context with no kiosk storage, checks the actual order, advances the phone clock, reloads the page, verifies the busy queue, checks a full-catalog QR, and verifies invalid-link recovery.

Both test commands now fail when no tests are discovered.
