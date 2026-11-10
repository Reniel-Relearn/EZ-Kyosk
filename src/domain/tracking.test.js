import { describe, expect, it } from 'vitest';
import { products } from '../data/menu';
import { createOrderSnapshot } from './order';
import { createTrackingToken, createTrackingUrl, getTrackingProgress, readTrackingToken } from './tracking';

const timestamp = Date.parse('2026-11-10T06:00:00.000Z');
const cart = [
  { id: 'espresso-americano::solo', productId: 'espresso-americano', variantId: 'solo', name: 'Americano', priceCentavos: 4800, quantity: 2 },
  { id: 'espresso-americano::b1t1', productId: 'espresso-americano', variantId: 'b1t1', name: 'Americano', priceCentavos: 8800, quantity: 1 },
  { id: 'donut-almond-choco', productId: 'donut-almond-choco', name: 'Almond Choco Mini Donuts', priceCentavos: 19800, quantity: 1 },
];
const order = createOrderSnapshot(cart, { id: 'B1T1-123456', createdAt: new Date(timestamp).toISOString() });
const encode = (payload) => btoa(JSON.stringify(payload)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');

describe('presentation tracking links', () => {
  it('preserves actual quantities, variants, prices and confirmation time across devices', () => {
    const decoded = readTrackingToken(createTrackingToken(order, products), products);
    expect(decoded).toMatchObject({ id: order.id, timestamp, queueAhead: 0, totalCentavos: 38200 });
    expect(decoded.items.map(({ quantity, unitPriceCentavos, variantLabel }) =>
      [quantity, unitPriceCentavos, variantLabel])).toEqual([
      [2, 4800, 'Solo · 1 cup'], [1, 8800, 'Buy 1 Take 1 · 2 cups'], [1, 19800, 'Box of 8'],
    ]);
  });

  it('retains the confirmed price even if the menu price changes later', () => {
    const updatedCatalog = products.map((product) => ({ ...product, priceCentavos: 99900 }));
    expect(readTrackingToken(createTrackingToken(order, products), updatedCatalog).totalCentavos).toBe(38200);
  });

  it('keeps the Pages base path and carries the payload in a URL fragment', () => {
    const url = new URL(createTrackingUrl(order, products, 'https://example.com/EZ-Kyosk/?old=1', 3));
    expect(url.pathname).toBe('/EZ-Kyosk/');
    expect(url.search).toBe('');
    expect(readTrackingToken(url.hash.slice(7), products).queueAhead).toBe(3);
  });

  it('supports every menu variant in one compact link', () => {
    const items = products.flatMap((product) => (product.variants ?? [null]).map((variant) => ({
      id: `${product.id}:${variant?.id ?? ''}`, productId: product.id, variantId: variant?.id,
      name: product.name, priceCentavos: variant?.priceCentavos ?? product.priceCentavos, quantity: 99,
    })));
    const largeOrder = createOrderSnapshot(items, { id: order.id, createdAt: order.createdAt });
    const url = createTrackingUrl(largeOrder, products, 'https://reniel-relearn.github.io/EZ-Kyosk/');
    expect(url.length).toBeLessThan(2200);
    expect(readTrackingToken(new URL(url).hash.slice(7), products).items).toHaveLength(60);
  });

  it.each([
    ['', 'empty'], ['not-a-token', 'malformed'],
    [encode([2, order.id, timestamp, 0, [[1, 'solo', 1, 4800]]]), 'unsupported version'],
    [encode([1, order.id, timestamp, 0, [[999, '', 1, 4800]]]), 'missing product'],
    [encode([1, order.id, timestamp, 0, [[1, 'unknown', 1, 4800]]]), 'missing variant'],
    [encode([1, order.id, timestamp, 0, [[1, 'solo', -1, 4800]]]), 'negative quantity'],
    [encode([1, order.id, timestamp, 0, [[1, 'solo', 1.5, 4800]]]), 'fractional quantity'],
    [encode([1, order.id, timestamp, 0, [[1, 'solo', 1, -4800]]]), 'negative price'],
    [encode([1, order.id, timestamp, 0, [[1, 'solo', Number.MAX_SAFE_INTEGER, 4800]]]), 'overflow'],
    [encode([1, order.id, timestamp, 0, [[1, 'solo', 1, 4800], [1, 'solo', 1, 4800]]]), 'duplicate line'],
    [encode([1, order.id, timestamp, 10, [[1, 'solo', 1, 4800]]]), 'unsupported queue'],
    [encode([1, order.id, -1, 0, [[1, 'solo', 1, 4800]]]), 'invalid time'],
  ])('rejects an invalid token (%s: %s)', (token) => {
    expect(() => readTrackingToken(token, products)).toThrow(/invalid/);
  });
});

describe('confirmation-based demo timing', () => {
  it.each([
    [0, 'received'], [4999, 'received'], [5000, 'preparing'],
    [29999, 'preparing'], [30000, 'ready'], [86400000, 'ready'],
  ])('uses the first-in-line state at %i ms', (elapsed, status) => {
    expect(getTrackingProgress(timestamp, 0, timestamp + elapsed)).toMatchObject({ status, ordersAhead: 0 });
  });

  it.each([
    [0, 'received', 3], [14999, 'received', 3], [15000, 'preparing', 2],
    [30000, 'preparing', 1], [45000, 'preparing', 0], [60000, 'ready', 0],
  ])('uses the busy-queue state at %i ms', (elapsed, status, ordersAhead) => {
    expect(getTrackingProgress(timestamp, 3, timestamp + elapsed)).toMatchObject({ status, ordersAhead });
  });

  it('clamps a phone clock that is earlier than confirmation to Received', () => {
    expect(getTrackingProgress(timestamp, 0, timestamp - 10000).status).toBe('received');
  });
});
