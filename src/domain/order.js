import {
  calculateLineTotal,
  calculateSubtotal,
  isValidCentavoAmount,
} from './money';

function isValidOrderItem(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    typeof item.name === 'string' &&
    item.name.length > 0 &&
    (item.productId === undefined || typeof item.productId === 'string') &&
    (item.variantId === undefined ||
      item.variantId === null ||
      typeof item.variantId === 'string') &&
    (item.variantLabel === undefined ||
      item.variantLabel === null ||
      typeof item.variantLabel === 'string') &&
    (item.servingCount === undefined ||
      (Number.isSafeInteger(item.servingCount) && item.servingCount > 0)) &&
    isValidCentavoAmount(item.priceCentavos) &&
    Number.isSafeInteger(item.quantity) &&
    item.quantity > 0
  );
}
export function createOrderSnapshot(items, { id, createdAt }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new TypeError('An order requires at least one valid item.');
  }

  if (typeof id !== 'string' || id.length === 0) {
    throw new TypeError('An order requires an identifier.');
  }

  if (typeof createdAt !== 'string' || Number.isNaN(Date.parse(createdAt))) {
    throw new TypeError('An order requires a valid creation timestamp.');
  }

  if (!items.every(isValidOrderItem)) {
    throw new TypeError('Order items must contain valid product and quantity data.');
  }

  const orderItems = items.map((item) => ({
    productId: item.productId ?? item.id,
    variantId: item.variantId ?? null,
    variantLabel: item.variantLabel ?? null,
    servingCount: item.servingCount ?? 1,
    name: item.name,
    unitPriceCentavos: item.priceCentavos,
    quantity: item.quantity,
    lineTotalCentavos: calculateLineTotal(item.priceCentavos, item.quantity),
  }));
  const subtotalCentavos = calculateSubtotal(items);

  return {
    id,
    createdAt,
    currency: 'PHP',
    items: orderItems,
    subtotalCentavos,
    totalCentavos: subtotalCentavos,
  };
}
