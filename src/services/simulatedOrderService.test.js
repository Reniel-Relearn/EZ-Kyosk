import { describe, expect, it } from 'vitest';
import { simulateOrderConfirmation } from './simulatedOrderService';

describe('simulated order service', () => {
  it('returns a deterministic local confirmation result', () => {
    const result = simulateOrderConfirmation(
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
      { now: () => new Date('2026-11-03T06:00:00.123Z') },
    );

    expect(result.status).toBe('simulated');
    expect(result.order.id).toMatch(/^B1T1-\d{6}$/);
    expect(result.order.totalCentavos).toBe(8800);
    expect(result.order.createdAt).toBe('2026-11-03T06:00:00.123Z');
  });
});
