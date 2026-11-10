# Presentation Image Performance

## Asset pipeline

The original 36 product PNGs and logo occupy 19,440,040 bytes. They remain in `src/assets/b1t1/` as authorized source assets and are not imported into the deployed application.

Run `npm run images:optimize` to regenerate the checked-in files in `src/assets/b1t1/optimized/` using development-only `sharp`:

- Product photos: 400px and 800px widths, preserved aspect ratio, WebP quality 84.
- Official wordmark: 640px width, lossless WebP to retain clean text edges.
- Compact product set plus logo: 235,314 bytes (98.8% below the originals).
- Large product set plus logo: 532,444 bytes (97.3% below the originals).
- Both sets and the shared logo together: 729,730 bytes. A browser selects the appropriate product size rather than downloading both variants for every card.

The first six product photos load eagerly, with high fetch priority reserved for the first photo. Later cards retain native lazy loading. `srcset` and `sizes` support responsive selection. Cart and review thumbnails use the compact image source. Images are separate cacheable files instead of being inlined into JavaScript.

Product photos have static loading placeholders and recoverable photo-unavailable displays. A failed image does not disable adding products, changing quantities, reviewing, or producing the tracking QR. Photo loading introduces no additional card animation.

## Verification method

The before/after comparison uses Chromium at 1080 × 1920, a 4 Mbps download limit, 100 ms simulated latency, and a disabled cache. It records the response completion time and transferred body bytes for the first six product photos over three cold-load trials. These are controlled local measurements, not SUNMI or real GitHub Pages network guarantees.

Before optimization, the first six photos transferred 3,183,419 bytes and completed at 10,147 / 12,080 / 12,113 ms after navigation.

After optimization, the same six photos transferred 36,572 bytes and completed at 838 / 846 / 846 ms. The median completion time fell from 12,080 ms to 846 ms (93.0% lower in this controlled comparison); transferred photo bytes fell by 98.9%.

To repeat the measurement, start `npm run preview -- --host 127.0.0.1 --port 4175 --strictPort` after building, then run `node scripts/measure-image-loading.mjs`. An optional first argument selects a different site URL.

## Production browser checks

`npm run test:e2e` builds the site first, launches Vite preview with the project's Pages base path, and runs the full browser suite against that build. CI uploads the tested `dist/` artifact without rebuilding it afterward.

The image scenarios cover all 36 photos, eager/lazy priority, responsive candidates, a delayed photo with stable card dimensions, failed-photo ordering through confirmation, and category switching. Physical SUNMI performance, browser compatibility, and camera scanning remain hardware acceptance checks.

Latest local checks: 47 unit tests passed, 22 production-browser tests passed, and the production build passed. Portrait and narrow-screen screenshots were visually inspected. No software failures were observed in these checks; this is not a guarantee for untested hardware or network conditions.
