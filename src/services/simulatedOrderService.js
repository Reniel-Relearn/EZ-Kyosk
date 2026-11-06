import { createOrderSnapshot } from '../domain/order';

function createPreviewNumber(timestamp) {
  return `B1T1-${String(timestamp).slice(-6).padStart(6, '0')}`;
}
export function simulateOrderConfirmation(items, options = {}) {
  const now = options.now ?? (() => new Date());
  const createdAt = now();

  if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
    throw new TypeError('The simulated order clock returned an invalid date.');
  }

  const order = createOrderSnapshot(items, {
    id: createPreviewNumber(createdAt.getTime()),
    createdAt: createdAt.toISOString(),
  });

  return {
    status: 'simulated',
    order,
  };
}
