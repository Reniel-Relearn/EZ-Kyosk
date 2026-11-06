import { describe, expect, it } from 'vitest';
import { createOrderSnapshot } from './order';

const items = [
  {
    id: 'espresso-americano',
    name: 'Americano',
    priceCentavos: 4800,
    quantity: 2,
  },
  {
    id: 'espresso-latte',
    name: 'Latte',
    priceCentavos: 7800,
    quantity: 1,
  },
];

describe('order snapshot', () => {
  it('creates a reusable order structure with derived totals', () => {
    const order = createOrderSnapshot(items, {
      id: 'B1T1-123456',
      createdAt: '2026-11-03T06:00:00.000Z',
    });

    expect(order).toMatchObject({
      id: 'B1T1-123456',
      currency: 'PHP',
      subtotalCentavos: 17400,
      totalCentavos: 17400,
    });
    expect(order.items[0].lineTotalCentavos).toBe(9600);
  });

  it('preserves B1T1 variant identity in the reusable order structure', () => {
    const order = createOrderSnapshot(
      [
        {
          id: 'espresso-americano::b1t1',
          productId: 'espresso-americano',
          variantId: 'b1t1',
          variantLabel: 'Buy 1 Take 1 · 2 cups',
          servingCount: 2,
          name: 'Americano',
          priceCentavos: 8800,
          quantity: 1,
        },
      ],
      { id: 'B1T1-123456', createdAt: '2026-11-03T06:00:00.000Z' },
    );

    expect(order.items[0]).toMatchObject({
      productId: 'espresso-americano',
      variantId: 'b1t1',
      variantLabel: 'Buy 1 Take 1 · 2 cups',
      servingCount: 2,
      lineTotalCentavos: 8800,
    });
  });

  it('rejects empty or invalid order data', () => {
    expect(() =>
      createOrderSnapshot([], {
        id: 'B1T1-123456',
        createdAt: '2026-11-03T06:00:00.000Z',
      }),
    ).toThrow();
    expect(() =>
      createOrderSnapshot([{ ...items[0], quantity: 0 }], {
        id: 'B1T1-123456',
        createdAt: '2026-11-03T06:00:00.000Z',
      }),
    ).toThrow();
  });
});
