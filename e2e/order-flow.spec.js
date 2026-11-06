import { expect, test } from '@playwright/test';

test.describe('B1T1 Takeaway Coffee ordering flow', () => {
  test('offers a touch fullscreen toggle from the bottom-left corner', async ({ page }) => {
    await page.addInitScript(() => {
      let fullscreenElement = null;

      Object.defineProperty(Document.prototype, 'fullscreenElement', {
        configurable: true,
        get: () => fullscreenElement,
      });
      Object.defineProperty(Element.prototype, 'requestFullscreen', {
        configurable: true,
        value: async function requestFullscreen() {
          fullscreenElement = this;
          document.dispatchEvent(new Event('fullscreenchange'));
        },
      });
      Object.defineProperty(Document.prototype, 'exitFullscreen', {
        configurable: true,
        value: async () => {
          fullscreenElement = null;
          document.dispatchEvent(new Event('fullscreenchange'));
        },
      });
    });

    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.goto('/');

    const enterButton = page.getByRole('button', { name: 'Enter fullscreen' });
    await expect(enterButton).toBeVisible();
    await expect(enterButton).toHaveCSS('position', 'fixed');

    const position = await enterButton.boundingBox();
    expect(position.x).toBeLessThan(20);
    expect(position.y + position.height).toBeGreaterThan(1900);

    await enterButton.click();
    const exitButton = page.getByRole('button', { name: 'Exit fullscreen' });
    await expect(exitButton).toHaveAttribute('aria-pressed', 'true');

    await exitButton.click();
    await expect(page.getByRole('button', { name: 'Enter fullscreen' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('creates, reviews, and confirms a simulated order', async ({ page }) => {
    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'What are you sipping today?' }),
    ).toBeVisible();

    await expect(page.locator('.product-card')).toHaveCount(36);
    await page.getByRole('button', { name: 'Add Americano Solo to order' }).click();
    await page.getByRole('button', { name: 'Add Americano Buy 1 Take 1 to order' }).click();
    await page.getByRole('button', { name: 'Add Latte Solo to order' }).click();
    await page.getByRole('button', { name: 'Increase Latte Solo · 1 cup quantity' }).click();

    await expect(
      page.locator('.cart-panel__footer .total-row strong'),
    ).toHaveText('₱292');
    await expect(page.getByText('Buy 1 Take 1 · 2 cups')).toBeVisible();
    await page.getByRole('button', { name: /Review Order/ }).click();

    await expect(page.getByRole('heading', { name: 'Is everything just right?' })).toBeVisible();
    await expect(page.getByText('Buy 1 Take 1 · 2 cups · Quantity 1')).toBeVisible();
    await page.getByRole('button', { name: 'Confirm presentation order' }).click();

    await expect(page.getByRole('heading', { name: 'Your B1T1 order looks perfect.' })).toBeVisible();
    await expect(page.getByText('Nothing was sent to B1T1', { exact: false })).toBeVisible();
  });

  test('adapts the order summary to a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 900 });
    await page.goto('/');

    await expect(
      page.getByRole('complementary', { name: 'Your order' }),
    ).toBeHidden();
    await page.getByRole('button', { name: 'Add Americano Solo to order' }).click();
    await expect(page.getByRole('button', { name: 'Open your order' })).toBeVisible();
    await page.getByRole('button', { name: 'Open your order' }).click();
    await expect(page.getByRole('complementary', { name: 'Your order' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Review Order/ })).toBeEnabled();
  });

  test('supports category filtering, search, and item removal', async ({ page }) => {
    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Espresso', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Espresso', exact: true })).toBeVisible();
    await page.getByRole('searchbox', { name: 'Search the menu' }).fill('Vietnamese');
    await expect(page.getByRole('heading', { name: 'Vietnamese' })).toBeVisible();
    await expect(page.getByText('1 choice')).toBeVisible();

    await page.getByRole('button', { name: 'Add Vietnamese Buy 1 Take 1 to order' }).click();
    await page
      .getByRole('button', {
        name: 'Remove Vietnamese Buy 1 Take 1 · 2 cups from order',
      })
      .click();
    await expect(page.getByRole('heading', { name: 'Your cup is waiting' })).toBeVisible();
  });

  test('adds single-price waffles and labeled donut boxes', async ({ page }) => {
    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Waffles', exact: true }).click();
    await page.getByRole('button', { name: 'Add Plain Waffle to order' }).click();
    await expect(page.locator('.cart-panel__footer .total-row strong')).toHaveText('₱58');

    await page.getByRole('button', { name: 'Mini Donuts', exact: true }).click();
    await page
      .getByRole('button', { name: 'Add Almond Choco Mini Donuts to order' })
      .click();

    await expect(page.getByText('Box of 8', { exact: true })).toBeVisible();
    await expect(page.locator('.cart-panel__footer .total-row strong')).toHaveText('₱256');
  });

  test('keeps a five-product order independently scrollable', async ({ page }) => {
    await page.setViewportSize({ width: 1080, height: 800 });
    await page.goto('/');

    for (const productName of [
      'Americano',
      'Latte',
      'Ube Latte',
      'Brown Sugar',
      'Dark Mocha Latte',
    ]) {
      await page.getByRole('button', { name: `Add ${productName} Solo to order` }).click();
    }

    const orderItems = page.locator('.cart-panel__items');
    const beforeScroll = await orderItems.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
    }));

    expect(beforeScroll.scrollHeight).toBeGreaterThan(beforeScroll.clientHeight);
    expect(beforeScroll.scrollTop).toBe(0);

    await orderItems.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });

    await expect(page.getByRole('heading', { name: 'Dark Mocha Latte' }).last()).toBeVisible();
    expect(await orderItems.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await expect(page.getByRole('button', { name: /Review Order/ })).toBeVisible();
  });

  for (const viewport of [
    { width: 1080, height: 1920 },
    { width: 768, height: 1024 },
    { width: 430, height: 900 },
  ]) {
    test(`avoids page overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));

      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    });
  }
});

