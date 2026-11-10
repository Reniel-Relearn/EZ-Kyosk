import { expect, test } from '@playwright/test';

test.describe('B1T1 Takeaway Coffee ordering flow', () => {
  for (const viewport of [{ width: 1080, height: 800 }, { width: 430, height: 900 }]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      test(`resets category scrolling at ${viewport.width}x${viewport.height} with motion ${reducedMotion}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ reducedMotion });
        await page.goto('/');

        if (viewport.width === 1080) {
          for (const name of ['Americano', 'Latte', 'Ube Latte', 'Brown Sugar', 'Dark Mocha Latte']) {
            await page.getByRole('button', { name: `Add ${name} Solo to order` }).click();
          }
        }
        const cartItems = page.locator('.cart-panel__items');
        await cartItems.evaluate((element) => { element.scrollTop = element.scrollHeight; });
        const cartScroll = await cartItems.evaluate((element) => element.scrollTop);
        if (viewport.width === 1080) expect(cartScroll).toBeGreaterThan(0);

        await page.getByRole('button', { name: 'Frappe', exact: true }).click();
        const catalog = page.locator('.catalog');
        await catalog.evaluate((element) => { element.scrollTop = element.scrollHeight; });
        expect(await catalog.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

        // Clicking the already-active category must not interrupt browsing.
        const frappeScroll = await catalog.evaluate((element) => element.scrollTop);
        await page.getByRole('button', { name: 'Frappe', exact: true }).click();
        expect(await catalog.evaluate((element) => element.scrollTop)).toBe(frappeScroll);

        await page.getByRole('button', { name: 'Fruit Tea', exact: true }).click();
        await expect.poll(() => catalog.evaluate((element) => element.scrollTop)).toBe(0);
        await expect(page.getByRole('heading', { name: 'Fruit Tea', exact: true })).toBeInViewport();
        await expect(page.locator('.product-card')).toHaveCount(5);
        expect(await cartItems.evaluate((element) => element.scrollTop)).toBe(cartScroll);
      });
    }
  }

  test('animates cards only when changing categories', async ({ page }) => {
    await page.addInitScript(() => {
      window.cardAnimations = [];
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (keyframes, options) {
        if (this.matches('.product-card')) {
          window.cardAnimations.push({ keyframes, options });
        }
        return animate.call(this, keyframes, options);
      };
    });
    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.goto('/');

    const categoryButtons = page.getByRole('navigation', { name: 'Menu categories' }).getByRole('button');
    await expect(categoryButtons.nth(1)).toHaveText('Frappe');
    expect(await page.evaluate(() => window.cardAnimations.length)).toBe(0);

    await page.getByRole('button', { name: 'Frappe', exact: true }).click();
    const cardCount = await page.locator('.product-card').count();
    expect(cardCount).toBe(5);
    const animations = await page.evaluate(() => window.cardAnimations);
    expect(animations).toHaveLength(cardCount);
    expect(animations[0]).toMatchObject({
      keyframes: [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      options: { duration: 250 },
    });

    await page.getByRole('button', { name: 'Frappe', exact: true }).click();
    await page.getByRole('button', { name: 'Add Strawberry Solo to order' }).click();
    await page.getByRole('searchbox', { name: 'Search the menu' }).fill('Espresso');
    await page.locator('.catalog').evaluate((element) => { element.scrollTop = 300; });
    await page.getByRole('combobox', { name: 'Sort products' }).selectOption('price-low');
    expect(await page.evaluate(() => window.cardAnimations.length)).toBe(cardCount);

    await page.getByRole('searchbox', { name: 'Search the menu' }).clear();
    await page.getByRole('button', { name: 'All', exact: true }).click();
    expect(await page.evaluate(() => window.cardAnimations.length)).toBe(cardCount + 36);
  });

  test('does not animate category changes when reduced motion is requested', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      window.cardAnimationCount = 0;
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (...args) {
        if (this.matches('.product-card')) window.cardAnimationCount += 1;
        return animate.apply(this, args);
      };
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Frappe', exact: true }).click();
    await expect(page.locator('.product-card')).toHaveCount(5);
    expect(await page.evaluate(() => window.cardAnimationCount)).toBe(0);
  });

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

