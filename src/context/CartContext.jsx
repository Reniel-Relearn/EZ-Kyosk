import { createContext, useContext, useMemo, useReducer } from 'react';
import { cartReducer, initialCartState } from '../domain/cart';
import { calculateSubtotal } from '../domain/money';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const value = useMemo(() => {
    const itemCount = state.items.reduce(
      (count, item) => count + item.quantity,
      0,
    );

    return {
      items: state.items,
      itemCount,
      subtotalCentavos: calculateSubtotal(state.items),
      addItem: (product) => dispatch({ type: 'add', product }),
      incrementItem: (productId) => dispatch({ type: 'increment', productId }),
      decrementItem: (productId) => dispatch({ type: 'decrement', productId }),
      removeItem: (productId) => dispatch({ type: 'remove', productId }),
      clearCart: () => dispatch({ type: 'clear' }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider.');
  }

  return context;
}

