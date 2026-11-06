import { describe, expect, it } from 'vitest';
import { cartReducer, initialCartState } from './cart';

const product = {
  id: 'waffle-plain',
  name: 'Plain Waffle',
  priceCentavos: 5800,
  image: '/waffle-plain.png',
};

describe('cart reducer', () => {
  it('adds a valid product and combines repeated additions', () => {
    const once = cartReducer(initialCartState, { type: 'add', product });
    const twice = cartReducer(once, { type: 'add', product });

    expect(twice.items).toHaveLength(1);
    expect(twice.items[0].quantity).toBe(2);
  });

  it('keeps Solo and B1T1 selections as distinct cart lines', () => {
    const solo = {
      ...product,
      id: 'americano::solo',
      productId: 'americano',
      variantId: 'solo',
      variantLabel: 'Solo · 1 cup',
      servingCount: 1,
      priceCentavos: 4800,
    };
    const b1t1 = {
      ...product,
      id: 'americano::b1t1',
      productId: 'americano',
      variantId: 'b1t1',
      variantLabel: 'Buy 1 Take 1 · 2 cups',
      servingCount: 2,
      priceCentavos: 8800,
    };

    const withSolo = cartReducer(initialCartState, { type: 'add', product: solo });
    const withBoth = cartReducer(withSolo, { type: 'add', product: b1t1 });

    expect(withBoth.items).toHaveLength(2);
    expect(withBoth.items.map((item) => item.priceCentavos)).toEqual([4800, 8800]);
    expect(withBoth.items[1]).toMatchObject({
      productId: 'americano',
      variantId: 'b1t1',
      servingCount: 2,
    });
  });

  it('increments, decrements, and removes an item at zero', () => {
    const added = cartReducer(initialCartState, { type: 'add', product });
    const incremented = cartReducer(added, {
      type: 'increment',
      productId: product.id,
    });
    const decremented = cartReducer(incremented, {
      type: 'decrement',
      productId: product.id,
    });
    const removed = cartReducer(decremented, {
      type: 'decrement',
      productId: product.id,
    });

    expect(incremented.items[0].quantity).toBe(2);
    expect(decremented.items[0].quantity).toBe(1);
    expect(removed.items).toEqual([]);
  });

  it('ignores products with invalid prices', () => {
    const state = cartReducer(initialCartState, {
      type: 'add',
      product: { ...product, priceCentavos: -1 },
    });

    expect(state).toEqual(initialCartState);
  });

  it('clears the current order', () => {
    const added = cartReducer(initialCartState, { type: 'add', product });
    expect(cartReducer(added, { type: 'clear' })).toEqual(initialCartState);
  });

  it('does not increment beyond the safe integer range', () => {
    const state = {
      items: [{ ...product, quantity: Number.MAX_SAFE_INTEGER }],
    };
    const result = cartReducer(state, {
      type: 'increment',
      productId: product.id,
    });

    expect(result.items[0].quantity).toBe(Number.MAX_SAFE_INTEGER);
  });
});

