import { describe, expect, it } from 'vitest';
import { createOrderSnapshot } from './order';

const items = [
  {
    id: 'chicken-adobo-bowl',
    name: 'Chicken Adobo Bowl',
    priceCentavos: 17900,
    quantity: 2,
  },
  {
    id: 'iced-spanish-latte',
    name: 'Iced Spanish Latte',
    priceCentavos: 14500,
    quantity: 1,
  },
];

describe('order snapshot', () => {
  it('creates a reusable order structure with derived totals', () => {
    const order = createOrderSnapshot(items, {
      id: 'EZ-123456',
      createdAt: '2026-11-03T06:00:00.000Z',
    });

    expect(order).toMatchObject({
      id: 'EZ-123456',
      currency: 'PHP',
      subtotalCentavos: 50300,
      totalCentavos: 50300,
    });
    expect(order.items[0].lineTotalCentavos).toBe(35800);
  });

  it('rejects empty or invalid order data', () => {
    expect(() =>
      createOrderSnapshot([], {
        id: 'EZ-123456',
        createdAt: '2026-11-03T06:00:00.000Z',
      }),
    ).toThrow();
    expect(() =>
      createOrderSnapshot([{ ...items[0], quantity: 0 }], {
        id: 'EZ-123456',
        createdAt: '2026-11-03T06:00:00.000Z',
      }),
    ).toThrow();
  });
});
