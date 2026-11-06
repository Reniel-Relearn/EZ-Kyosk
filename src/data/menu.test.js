import { describe, expect, it } from 'vitest';
import { categories, products } from './menu';

describe('B1T1 menu catalog', () => {
  it('contains the complete authorized catalog and official categories', () => {
    expect(products).toHaveLength(36);
    expect(categories.map((category) => category.id)).toEqual([
      'all',
      'espresso',
      'matcha',
      'chocolate',
      'frappe',
      'fruit-tea',
      'donuts',
      'waffles',
    ]);
  });

  it('uses unique product and source identifiers with local images', () => {
    const validCategoryIds = new Set(
      categories.slice(1).map((category) => category.id),
    );

    expect(new Set(products.map((product) => product.id)).size).toBe(36);
    expect(new Set(products.map((product) => product.sourceId)).size).toBe(36);

    for (const product of products) {
      expect(product.image).toMatch(/\/assets\/.*\.png$/);
      expect(product.name.length).toBeGreaterThan(0);
      expect(product.description.length).toBeGreaterThan(0);
      expect(validCategoryIds.has(product.categoryId)).toBe(true);
      expect(Number.isSafeInteger(product.priceCentavos)).toBe(true);
      expect(product.priceCentavos).toBeGreaterThan(0);
    }
  });

  it('models all 24 drinks with distinct Solo and Buy 1 Take 1 prices', () => {
    const drinks = products.filter((product) => product.variants);
    expect(drinks).toHaveLength(24);

    for (const product of drinks) {
      expect(new Set(product.variants.map((variant) => variant.id)).size).toBe(
        product.variants.length,
      );
      expect(product.variants.map((variant) => variant.id)).toEqual([
        'solo',
        'b1t1',
      ]);
      expect(product.priceCentavos).toBe(product.variants[0].priceCentavos);
      expect(product.variants[1].priceCentavos).toBeGreaterThan(
        product.variants[0].priceCentavos,
      );
      expect(product.variants[1].servingCount).toBe(2);

      for (const variant of product.variants) {
        expect(Number.isSafeInteger(variant.priceCentavos)).toBe(true);
        expect(variant.priceCentavos).toBeGreaterThan(0);
        expect(Number.isSafeInteger(variant.servingCount)).toBe(true);
        expect(variant.servingCount).toBeGreaterThan(0);
      }
    }
  });
});
