import { calculateLineTotal, formatPHP } from '../domain/money';
import { useCart } from '../context/CartContext';
import { Icon } from './Icon';

export function CartPanel({ isOpen, onClose, onReview }) {
  const {
    items,
    itemCount,
    subtotalCentavos,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCart();

  return (
    <>
      <button
        aria-label="Close order panel"
        className={`cart-scrim ${isOpen ? 'is-visible' : ''}`}
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label="Your order"
        className={`cart-panel ${isOpen ? 'is-open' : ''}`}
      >
        <header className="cart-panel__header">
          <div>
            <p className="eyebrow">Current selection</p>
            <h2>Your Order</h2>
          </div>
          <span className="cart-panel__count">{itemCount}</span>
          <button
            aria-label="Close order panel"
            className="icon-button cart-panel__close"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" size={22} />
          </button>
        </header>

        <div aria-live="polite" className="cart-panel__items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart__icon"><Icon name="cart" size={30} /></div>
              <h3>Your tray is waiting</h3>
              <p>Add something delicious and it will appear here.</p>
            </div>
          ) : (
            items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img alt="" className="cart-item__image" src={item.image} />
                <div className="cart-item__content">
                  <div className="cart-item__title-row">
                    <h3>{item.name}</h3>
                    <strong>
                      {formatPHP(calculateLineTotal(item.priceCentavos, item.quantity))}
                    </strong>
                  </div>
                  <div className="cart-item__actions">
                    <div className="quantity-control">
                      <button
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() => decrementItem(item.id)}
                        type="button"
                      >
                        <Icon name="minus" size={16} />
                      </button>
                      <span aria-label={`${item.quantity} selected`}>{item.quantity}</span>
                      <button
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() => incrementItem(item.id)}
                        type="button"
                      >
                        <Icon name="plus" size={16} />
                      </button>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => removeItem(item.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <footer className="cart-panel__footer">
          <div className="price-row">
            <span>Subtotal</span>
            <strong>{formatPHP(subtotalCentavos)}</strong>
          </div>
          <div className="total-row">
            <span>Total</span>
            <strong>{formatPHP(subtotalCentavos)}</strong>
          </div>
          <p className="cart-panel__note">Taxes and fees are not applied in this prototype.</p>
          <button
            className="primary-button"
            disabled={items.length === 0}
            onClick={onReview}
            type="button"
          >
            Review Order <span>{formatPHP(subtotalCentavos)}</span>
          </button>
        </footer>
      </aside>
    </>
  );
}

