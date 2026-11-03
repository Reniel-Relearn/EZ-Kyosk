import { describe, expect, it } from 'vitest';
import {
  calculateLineTotal,
  calculateSubtotal,
  formatPHP,
  isValidCentavoAmount,
} from './money';

describe('money domain', () => {
  it('calculates line totals using integer centavos', () => {
    expect(calculateLineTotal(14900, 3)).toBe(44700);
  });

  it('calculates the subtotal from cart lines', () => {
    expect(
      calculateSubtotal([
        { priceCentavos: 14900, quantity: 2 },
        { priceCentavos: 4900, quantity: 1 },
      ]),
    ).toBe(34700);
  });

  it('rejects negative, fractional, and invalid values', () => {
    expect(isValidCentavoAmount(-1)).toBe(false);
    expect(isValidCentavoAmount(149.5)).toBe(false);
    expect(() => calculateLineTotal(14900, 0)).toThrow();
  });

  it('formats whole and fractional peso values', () => {
    expect(formatPHP(14900)).toContain('₱149');
    expect(formatPHP(14950)).toContain('₱149.50');
  });
});

