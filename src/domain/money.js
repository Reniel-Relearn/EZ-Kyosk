export function isValidCentavoAmount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

export function calculateLineTotal(unitPriceCentavos, quantity) {
  if (!isValidCentavoAmount(unitPriceCentavos)) {
    throw new TypeError('Unit price must be a non-negative integer centavo amount.');
  }

  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new TypeError('Quantity must be a positive integer.');
  }

  const total = unitPriceCentavos * quantity;

  if (!Number.isSafeInteger(total)) {
    throw new RangeError('Line total exceeds the supported integer range.');
  }

  return total;
}

export function calculateSubtotal(items) {
  if (!Array.isArray(items)) {
    return 0;
  }

  return items.reduce((subtotal, item) => {
    const nextSubtotal =
      subtotal + calculateLineTotal(item.priceCentavos, item.quantity);

    if (!Number.isSafeInteger(nextSubtotal)) {
      throw new RangeError('Subtotal exceeds the supported integer range.');
    }

    return nextSubtotal;
  }, 0);
}

export function formatPHP(centavos) {
  if (!isValidCentavoAmount(centavos)) {
    return '₱0';
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: centavos % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(centavos / 100);
}

