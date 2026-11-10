import { expect, test } from '@playwright/test';

test('loads every optimized product image and prioritizes the first visible cards', async ({ page }) => {
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.goto('/');
  const images = page.locator('.product-card__image');
  await expect(images).toHaveCount(36);
  await expect(images.first()).toHaveAttribute('loading', 'eager');
  await expect(images.first()).toHaveAttribute('fetchpriority', 'high');
  await expect(images.nth(6)).toHaveAttribute('loading', 'lazy');
  await expect(images.first()).toHaveAttribute('srcset', /400w, .*800w/);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
    expect(await image.evaluate((element) => element.currentSrc)).toMatch(/\.webp$/);
  }
});

test('shows a stable loading placeholder until the photo arrives', async ({ page }) => {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  await page.route('**/assets/espresso-americano-*.webp', async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const card = page.locator('.product-card').filter({ has: page.getByRole('heading', { name: 'Americano', exact: true }) });
    await expect(card.getByText('Loading photo')).toBeVisible();
    const before = await card.boundingBox();
    release();
    await expect(card.locator('.menu-image')).toHaveClass(/is-loaded/);
    await expect(card.getByText('Loading photo')).toHaveCount(0);
    const after = await card.boundingBox();
    expect(after.height).toBe(before.height);
    expect(after.width).toBe(before.width);
  } finally { release(); }
});

test('failed photos have a fallback and do not prevent ordering or review', async ({ page }) => {
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.route('**/assets/espresso-americano-*.webp', (route) => route.abort());
  await page.goto('/');
  const card = page.locator('.product-card').filter({ has: page.getByRole('heading', { name: 'Americano', exact: true }) });
  await expect(card.getByText('Photo unavailable')).toBeVisible();
  await page.getByRole('button', { name: 'Add Americano Solo to order' }).click();
  await expect(page.locator('.cart-item .menu-image')).toHaveClass(/is-error/);
  await expect(page.locator('.cart-panel__footer .total-row strong')).toHaveText('₱48');
  await page.getByRole('button', { name: /Review Order/ }).click();
  await expect(page.locator('.review-item .menu-image')).toHaveClass(/is-error/);
  await page.getByRole('button', { name: 'Confirm presentation order' }).click();
  await expect(page.getByRole('img', { name: 'Scan to track your demo order' })).toBeVisible();
});

test('switching categories during image loading leaves no stuck placeholders', async ({ page }) => {
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.goto('/');
  for (const name of ['Frappe', 'Espresso', 'Matcha', 'All']) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.locator('.product-card .menu-image').first()).toHaveClass(/is-loaded/);
  }
});
