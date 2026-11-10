import { calculateLineTotal } from './money';

const MAX_TOKEN_LENGTH = 5000;

function positiveInteger(value) {
  return Number.isSafeInteger(value) && value > 0;
}

// Compact, versioned presentation data. This is an unsigned demo, not an order receipt.
export function createTrackingToken(order, catalog, queueAhead = 0) {
  const lines = order.items.map((item) => {
    const product = catalog.find((entry) => entry.id === item.productId);
    if (!product) throw new TypeError('This product is no longer in the demo menu.');
    return [
      product.sourceId,
      item.variantId ?? '',
      item.quantity,
      item.unitPriceCentavos,
    ];
  });
  const payload = [1, order.id, Date.parse(order.createdAt), queueAhead, lines];
  const token = btoa(JSON.stringify(payload))
    .replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
  // Apply the same validation to generated and scanned links.
  readTrackingToken(token, catalog);
  return token;
}

export function createTrackingUrl(order, catalog, baseUrl, queueAhead = 0) {
  const url = new URL(baseUrl);
  url.search = '';
  url.hash = `track=${createTrackingToken(order, catalog, queueAhead)}`;
  return url.href;
}

export function readTrackingToken(token, catalog) {
  try {
    if (typeof token !== 'string' || !token.length || token.length > MAX_TOKEN_LENGTH ||
      !/^[A-Za-z0-9_-]+$/.test(token)) throw new Error();
    const payload = JSON.parse(atob(token.replaceAll('-', '+').replaceAll('_', '/')));
    if (!Array.isArray(payload) || payload.length !== 5) throw new Error();
    const [version, id, timestamp, queueAhead, lines] = payload;
    if (version !== 1 || typeof id !== 'string' || !/^B1T1-\d{6}$/.test(id) ||
      !positiveInteger(timestamp) || timestamp > 8640000000000000 ||
      ![0, 3].includes(queueAhead) || !Array.isArray(lines) ||
      lines.length === 0 || lines.length > 60) throw new Error();

    const identities = new Set();
    let totalCentavos = 0;
    const items = lines.map((line) => {
      if (!Array.isArray(line) || line.length !== 4) throw new Error();
      const [sourceId, variantId, quantity, unitPriceCentavos] = line;
      const product = catalog.find((entry) => entry.sourceId === sourceId);
      if (!product || !positiveInteger(quantity) || !positiveInteger(unitPriceCentavos)) {
        throw new Error();
      }
      const variant = product.variants?.find((entry) => entry.id === variantId);
      if (product.variants ? !variant : variantId !== '') throw new Error();
      const identity = `${sourceId}:${variantId}`;
      if (identities.has(identity)) throw new Error();
      identities.add(identity);
      const lineTotalCentavos = calculateLineTotal(unitPriceCentavos, quantity);
      totalCentavos += lineTotalCentavos;
      if (!Number.isSafeInteger(totalCentavos)) throw new Error();
      return {
        id: identity,
        name: product.name,
        variantLabel: variant
          ? `${variant.label} · ${variant.servingCount} ${variant.servingCount === 1 ? 'cup' : 'cups'}`
          : product.categoryId === 'donuts' ? 'Box of 8' : null,
        quantity,
        unitPriceCentavos,
        lineTotalCentavos,
      };
    });
    return { id, timestamp, queueAhead, items, totalCentavos };
  } catch {
    throw new TypeError('This demo tracking link is invalid or uses an unavailable menu.');
  }
}

export function getTrackingProgress(timestamp, queueAhead = 0, now = Date.now()) {
  const elapsed = Math.max(0, now - timestamp);
  const preparingAt = queueAhead === 3 ? 15000 : 5000;
  const readyAt = queueAhead === 3 ? 60000 : 30000;
  const status = elapsed >= readyAt ? 'ready' : elapsed >= preparingAt ? 'preparing' : 'received';
  return {
    status,
    ordersAhead: queueAhead === 3 ? Math.max(0, 3 - Math.floor(elapsed / 15000)) : 0,
    readyInSeconds: Math.max(0, Math.ceil((readyAt - elapsed) / 1000)),
  };
}
