import { expect, test } from '@playwright/test';

test.describe('EZ Kyosk ordering flow', () => {
  test('creates, reviews, and confirms a simulated order', async ({ page }) => {
    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'What are you craving today?' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Add Chicken Adobo Bowl to order' }).click();
    await page.getByRole('button', { name: 'Add Iced Spanish Latte to order' }).click();
    await page.getByRole('button', { name: 'Increase Chicken Adobo Bowl quantity' }).click();

    await expect(
      page.locator('.cart-panel__footer .total-row strong'),
    ).toHaveText('₱503');
    await page.getByRole('button', { name: /Review Order/ }).click();

    await expect(page.getByRole('heading', { name: 'Is everything just right?' })).toBeVisible();
    await page.getByRole('button', { name: 'Confirm simulated order' }).click();

    await expect(page.getByRole('heading', { name: 'Your order looks perfect.' })).toBeVisible();
    await expect(page.getByText('Nothing was sent to a restaurant or payment provider.', { exact: false })).toBeVisible();
  });

  test('adapts the order summary to a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 900 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Add Chicken Adobo Bowl to order' }).click();
    await expect(page.getByRole('button', { name: 'Open your order' })).toBeVisible();
    await page.getByRole('button', { name: 'Open your order' }).click();
    await expect(page.getByRole('complementary', { name: 'Your order' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Review Order/ })).toBeEnabled();
  });

  test('supports category filtering, search, and item removal', async ({ page }) => {
    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Meals' }).click();
    await expect(page.getByRole('heading', { name: 'Meals', exact: true })).toBeVisible();
    await page.getByRole('searchbox', { name: 'Search the menu' }).fill('tapa');
    await expect(page.getByRole('heading', { name: 'Classic Beef Tapa' })).toBeVisible();
    await expect(page.getByText('1 choices')).toBeVisible();

    await page.getByRole('button', { name: 'Add Classic Beef Tapa to order' }).click();
    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(page.getByRole('heading', { name: 'Your tray is waiting' })).toBeVisible();
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

