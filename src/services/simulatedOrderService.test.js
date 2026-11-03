import { describe, expect, it } from 'vitest';
import { simulateOrderConfirmation } from './simulatedOrderService';

describe('simulated order service', () => {
  it('returns a deterministic local confirmation result', () => {
    const result = simulateOrderConfirmation(
      [
        {
          id: 'ube-cheesecake',
          name: 'Ube Cheesecake',
          priceCentavos: 13900,
          quantity: 1,
        },
      ],
      { now: () => new Date('2026-11-03T06:00:00.123Z') },
    );

    expect(result.status).toBe('simulated');
    expect(result.order.id).toMatch(/^EZ-\d{6}$/);
    expect(result.order.totalCentavos).toBe(13900);
    expect(result.order.createdAt).toBe('2026-11-03T06:00:00.123Z');
  });
});
