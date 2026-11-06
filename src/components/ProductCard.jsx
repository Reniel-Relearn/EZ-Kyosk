import { formatPHP } from '../domain/money';
import { Icon } from './Icon';

export function ProductCard({ product, onAdd }) {
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          alt={product.name}
          className="product-card__image"
          loading="lazy"
          src={product.image}
        />
        {hasVariants && <span className="product-card__badge">B1T1 available</span>}
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        {hasVariants ? (
          <div className="product-card__options">
            {product.variants.map((variant) => (
              <button
                aria-label={`Add ${product.name} ${variant.label} to order`}
                className={`product-option-button ${variant.id === 'b1t1' ? 'is-b1t1' : ''}`}
                key={variant.id}
                onClick={() => onAdd(product, variant)}
                type="button"
              >
                <span>{variant.id === 'b1t1' ? 'B1T1' : variant.label}</span>
                <strong>{formatPHP(variant.priceCentavos)}</strong>
                <Icon name="plus" size={16} />
              </button>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </article>
  );
}

