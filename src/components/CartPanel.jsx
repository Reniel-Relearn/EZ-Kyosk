import { calculateLineTotal, formatPHP } from '../domain/money';
import { useCart } from '../context/CartContext';
import { Icon } from './Icon';
import { ProductImage } from './ProductImage';

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
      {isOpen ? (
        <button
          aria-label="Close order panel"
          className="cart-scrim is-visible"
          onClick={onClose}
          type="button"
        />
      ) : null}
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
              <h3>Your cup is waiting</h3>
              <p>Choose a drink or treat and it will appear here.</p>
            </div>
          ) : (
            items.map((item) => (
              <article className="cart-item" key={item.id}>
                <ProductImage wrapperClassName="cart-item__image" src={item.image} priority />
                <div className="cart-item__content">
                  <div className="cart-item__title-row">
                    <div>
                      <h3>{item.name}</h3>
                      {item.variantLabel ? (
                        <p className="cart-item__variant">{item.variantLabel}</p>
                      ) : null}
                    </div>
                    <strong>
                      {formatPHP(calculateLineTotal(item.priceCentavos, item.quantity))}
                    </strong>
                  </div>
                  <div className="cart-item__actions">
                    <div className="quantity-control">
                      <button
                        aria-label={`Decrease ${item.name}${item.variantLabel ? ` ${item.variantLabel}` : ''} quantity`}
                        onClick={() => decrementItem(item.id)}
                        type="button"
                      >
                        <Icon name="minus" size={16} />
                      </button>
                      <span aria-label={`${item.quantity} selected`}>{item.quantity}</span>
                      <button
                        aria-label={`Increase ${item.name}${item.variantLabel ? ` ${item.variantLabel}` : ''} quantity`}
                        onClick={() => incrementItem(item.id)}
                        type="button"
                      >
                        <Icon name="plus" size={16} />
                      </button>
                    </div>
                    <button
                      aria-label={`Remove ${item.name}${item.variantLabel ? ` ${item.variantLabel}` : ''} from order`}
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
          <p className="cart-panel__note">Presentation mode · No payment will be taken.</p>
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

