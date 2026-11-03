import { isValidCentavoAmount } from './money';

export const initialCartState = { items: [] };

function isValidProduct(product) {
  return (
    product &&
    typeof product.id === 'string' &&
    product.id.length > 0 &&
    typeof product.name === 'string' &&
    product.name.length > 0 &&
    isValidCentavoAmount(product.priceCentavos)
  );
}

function addItem(items, product) {
  if (!isValidProduct(product)) {
    return items;
  }

  const existingItem = items.find((item) => item.id === product.id);

  if (existingItem) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [
    ...items,
    {
      id: product.id,
      name: product.name,
      priceCentavos: product.priceCentavos,
      image: product.image,
      quantity: 1,
    },
  ];
}

function incrementQuantity(item) {
  if (!Number.isSafeInteger(item.quantity) || item.quantity < 1) {
    return item;
  }

  if (item.quantity === Number.MAX_SAFE_INTEGER) {
    return item;
  }

  return { ...item, quantity: item.quantity + 1 };
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, items: addItem(state.items, action.product) };
    case 'increment':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.productId
            ? incrementQuantity(item)
            : item,
        ),
      };
    case 'decrement':
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.productId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    case 'remove':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.productId),
      };
    case 'clear':
      return initialCartState;
    default:
      return state;
  }
}

