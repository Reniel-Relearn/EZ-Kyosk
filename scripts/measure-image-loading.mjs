import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://127.0.0.1:4175/EZ-Kyosk/';
const browser = await chromium.launch();
try {
  const results = [];
  for (let trial = 0; trial < 3; trial += 1) {
    const context = await browser.newContext({ viewport: { width: 1080, height: 1920 } });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false, latency: 100, downloadThroughput: 500000, uploadThroughput: 125000,
    });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => {
      const images = [...document.querySelectorAll('.product-card__image')].slice(0, 6);
      return images.length === 6 && images.every((image) => image.complete && image.naturalWidth > 0);
    }, null, { timeout: 60000 });
    results.push(await page.evaluate(() => {
      const images = [...document.querySelectorAll('.product-card__image')].slice(0, 6);
      const resources = performance.getEntriesByType('resource');
      const requests = images.map((image) => resources.find((entry) => entry.name === image.currentSrc));
      return {
        firstSixReadyMs: Math.round(Math.max(...requests.map((entry) => entry.responseEnd))),
        firstSixImageBytes: requests.reduce((sum, entry) => sum + entry.encodedBodySize, 0),
        firstImageWidth: images[0].naturalWidth,
      };
    }));
    await context.close();
  }
  console.log(JSON.stringify({ url, network: '4 Mbps down, 100ms latency, cache disabled', trials: results }));
} finally { await browser.close(); }
