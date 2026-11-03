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
});

