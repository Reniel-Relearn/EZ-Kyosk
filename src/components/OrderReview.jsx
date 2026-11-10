import { useCart } from '../context/CartContext';
import { calculateLineTotal, formatPHP } from '../domain/money';
import { Icon } from './Icon';
import { ProductImage } from './ProductImage';

export function OrderReview({ onBack, onConfirm }) {
  const { items, itemCount, subtotalCentavos } = useCart();

  return (
    <section aria-labelledby="review-title" className="checkout-screen">
      <div className="checkout-screen__topbar">
        <button className="back-button" onClick={onBack} type="button">
          <Icon name="back" size={22} /> Back to menu
        </button>
        <span>B1T1 Takeaway Coffee · Order review</span>
      </div>
      <div className="review-layout">
        <div className="review-copy">
          <p className="eyebrow">One last look</p>
          <h1 id="review-title">Is everything just right?</h1>
          <p>Review your B1T1 selections before confirming this presentation order.</p>
          <div className="prototype-notice">
            <strong>Presentation mode</strong>
            <span>No payment will be taken and no order will be sent.</span>
          </div>
        </div>
        <div className="review-card">
          <div className="review-card__heading">
            <h2>Order summary</h2>
            <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          </div>
          <div className="review-card__items">
            {items.map((item) => (
              <div className="review-item" key={item.id}>
                <ProductImage wrapperClassName="review-item__image" src={item.image} priority />
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.variantLabel ? `${item.variantLabel} · ` : ''}
                    Quantity {item.quantity}
                  </p>
                </div>
                <strong>{formatPHP(calculateLineTotal(item.priceCentavos, item.quantity))}</strong>
              </div>
            ))}
          </div>
          <div className="review-card__total">
            <span>Total</span>
            <strong>{formatPHP(subtotalCentavos)}</strong>
          </div>
          <button className="primary-button" onClick={onConfirm} type="button">
            Confirm presentation order
          </button>
        </div>
      </div>
    </section>
  );
}

