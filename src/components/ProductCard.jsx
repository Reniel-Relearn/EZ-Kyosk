import { formatPHP } from '../domain/money';
import { Icon } from './Icon';

export function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          alt={product.name}
          className="product-card__image"
          loading="lazy"
          src={product.image}
        />
        {product.featured && <span className="product-card__badge">Guest favorite</span>}
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-card__footer">
          <strong>{formatPHP(product.priceCentavos)}</strong>
          <button
            aria-label={`Add ${product.name} to order`}
            className="add-button"
            onClick={() => onAdd(product)}
            type="button"
          >
            <Icon name="plus" size={25} />
          </button>
        </div>
      </div>
    </article>
  );
}

