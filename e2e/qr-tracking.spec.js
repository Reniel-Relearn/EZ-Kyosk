import { expect, test } from '@playwright/test';
import jsQR from 'jsqr';

async function decodeDisplayedQr(page) {
  const pixels = await page.getByRole('img', { name: 'Scan to track your demo order' }).evaluate(async (svg) => {
    const width = Math.round(svg.getBoundingClientRect().width);
    const clone = svg.cloneNode(true);
    clone.setAttribute('width', width);
    clone.setAttribute('height', width);
    const image = new Image();
    image.src = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(clone))}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = width;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, width);
    return { data: Array.from(context.getImageData(0, 0, width, width).data), width };
  });
  const decoded = jsQR(new Uint8ClampedArray(pixels.data), pixels.width, pixels.width);
  expect(decoded, 'The rendered QR should decode at its displayed size').not.toBeNull();
  expect(decoded.data).toBe(await page.getByRole('link', { name: 'Open tracking preview' }).getAttribute('href'));
  return decoded.data;
}

async function confirmOrder(page) {
  await page.getByRole('button', { name: /Review Order/ }).click();
  await page.getByRole('button', { name: 'Confirm presentation order' }).click();
  await expect(page.getByRole('heading', { name: 'Scan to track your order' })).toBeVisible();
}

test('QR opens the actual order in a fresh phone context and retains progress after reopening', async ({ page, browser }, testInfo) => {
  const start = new Date('2026-11-10T06:00:00Z');
  await page.clock.setFixedTime(start);
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Add Americano Solo to order' }).click();
  await page.getByRole('button', { name: 'Add Americano Buy 1 Take 1 to order' }).click();
  await page.getByRole('button', { name: 'Mini Donuts', exact: true }).click();
  await page.getByRole('button', { name: 'Add Almond Choco Mini Donuts to order' }).click();
  await confirmOrder(page);
  const url = await decodeDisplayedQr(page);
  await page.screenshot({ path: testInfo.outputPath('kiosk-qr.png') });

  const phoneContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const phone = await phoneContext.newPage();
    await phone.clock.setFixedTime(start);
    await phone.goto(url);
    await expect(phone.getByRole('heading', { name: 'Received', exact: true })).toBeVisible();
    await expect(phone.getByText('You’re first in line')).toBeVisible();
    await expect(phone.locator('.tracking-summary li')).toHaveCount(3);
    await expect(phone.getByText('Solo · 1 cup', { exact: true })).toBeVisible();
    await expect(phone.getByText('Buy 1 Take 1 · 2 cups', { exact: true })).toBeVisible();
    await expect(phone.getByText('Box of 8', { exact: true })).toBeVisible();
    await expect(phone.locator('.tracking-total strong')).toHaveText('₱334');
    await phone.clock.setFixedTime(new Date(start.getTime() + 5000));
    await expect(phone.getByRole('heading', { name: 'Preparing', exact: true })).toBeVisible();
    await phone.screenshot({ path: testInfo.outputPath('phone-preparing.png'), fullPage: true });
    await phone.reload();
    await expect(phone.getByRole('heading', { name: 'Preparing', exact: true })).toBeVisible();
    await phone.clock.setFixedTime(new Date(start.getTime() + 30000));
    await expect(phone.getByRole('heading', { name: 'Ready for pickup', exact: true })).toBeVisible();
    await phone.screenshot({ path: testInfo.outputPath('phone-ready.png'), fullPage: true });
    await phone.clock.setFixedTime(new Date(start.getTime() + 120000));
    await phone.reload();
    await expect(phone.getByRole('heading', { name: 'Ready for pickup', exact: true })).toBeVisible();
    const overflow = await phone.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  } finally { await phoneContext.close(); }

  await page.getByRole('button', { name: 'Start a new order' }).click();
  await expect(page.getByRole('heading', { name: 'Your cup is waiting' })).toBeVisible();
});

test('optional busy queue moves through three sample orders in 60 seconds', async ({ page }) => {
  const start = new Date('2026-11-10T06:00:00Z');
  await page.clock.setFixedTime(start);
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Add Latte Solo to order' }).click();
  await confirmOrder(page);
  await page.getByRole('radio', { name: '3 sample orders ahead · 60 seconds' }).check();
  const url = await decodeDisplayedQr(page);
  await page.goto(url);
  await expect(page.getByText('3 sample orders ahead', { exact: true })).toBeVisible();
  for (const [seconds, text] of [[15, '2 sample orders ahead'], [30, '1 sample order ahead'], [45, 'Your order is being prepared']]) {
    await page.clock.setFixedTime(new Date(start.getTime() + seconds * 1000));
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
  await page.clock.setFixedTime(new Date(start.getTime() + 60000));
  await expect(page.getByRole('heading', { name: 'Ready for pickup', exact: true })).toBeVisible();
});

test('a cart with all 60 menu choices still produces a decodable QR', async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.goto('/');
  const buttons = await page.locator('.product-card button').all();
  expect(buttons).toHaveLength(60);
  for (const button of buttons) await button.click();
  await confirmOrder(page);
  const url = await decodeDisplayedQr(page);
  await page.goto(url);
  await expect(page.locator('.tracking-summary li')).toHaveCount(60);
});

test('confirmation and tracking fit a 320px phone without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Add Americano Solo to order' }).click();
  await page.getByRole('button', { name: 'Open your order' }).click();
  await confirmOrder(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  const url = await decodeDisplayedQr(page);
  await page.goto(url);
  await expect(page.locator('.tracking-total strong')).toHaveText('₱48');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

for (const hash of ['#track=', '#track=broken', '#track=!!!']) {
  test(`invalid tracking link ${hash} has a recovery path`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(`/${hash}`);
    await expect(page.getByRole('heading', { name: 'This link isn’t available.' })).toBeVisible();
    await page.getByRole('link', { name: 'Back to the menu' }).click();
    await expect(page.getByRole('heading', { name: 'What are you sipping today?' })).toBeVisible();
  });
}
