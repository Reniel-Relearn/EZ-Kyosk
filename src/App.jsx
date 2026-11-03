import { useMemo, useState } from 'react';
import { CartPanel } from './components/CartPanel';
import { BrandMark, Icon } from './components/Icon';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrderReview } from './components/OrderReview';
import { ProductCard } from './components/ProductCard';
import { useCart } from './context/CartContext';
import { categories, products } from './data/menu';
import { formatPHP } from './domain/money';
import { simulateOrderConfirmation } from './services/simulatedOrderService';

export default function App() {
  const {
    addItem,
    clearCart,
    itemCount,
    items: cartItems,
    subtotalCentavos,
  } = useCart();
  const [activeCategory, setActiveCategory] = useState('best-sellers');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('popular');
  const [cartOpen, setCartOpen] = useState(false);
  const [screen, setScreen] = useState('menu');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatches =
        activeCategory === 'best-sellers'
          ? product.featured
          : product.categoryId === activeCategory;
      const searchMatches =
        !normalizedQuery ||
        `${product.name} ${product.description}`
          .toLowerCase()
          .includes(normalizedQuery);

      return categoryMatches && searchMatches;
    });

    return [...filtered].sort((first, second) => {
      if (sortOrder === 'price-low') {
        return first.priceCentavos - second.priceCentavos;
      }

      if (sortOrder === 'price-high') {
        return second.priceCentavos - first.priceCentavos;
      }

      return first.popularity - second.popularity;
    });
  }, [activeCategory, searchQuery, sortOrder]);

  const activeCategoryLabel = categories.find(
    (category) => category.id === activeCategory,
  )?.label;

  function handleAdd(product) {
    addItem(product);
  }

  function handleReview() {
    setCartOpen(false);
    setScreen('review');
  }

  function handleConfirm() {
    const result = simulateOrderConfirmation(cartItems);
    setConfirmedOrder(result.order);
    setScreen('confirmation');
  }

  function handleStartOver() {
    clearCart();
    setActiveCategory('best-sellers');
    setSearchQuery('');
    setConfirmedOrder(null);
    setScreen('menu');
  }

  if (screen === 'review') {
    return <OrderReview onBack={() => setScreen('menu')} onConfirm={handleConfirm} />;
  }

  if (screen === 'confirmation') {
    return (
      <OrderConfirmation
        onStartOver={handleStartOver}
        orderNumber={confirmedOrder.id}
      />
    );
  }

  return (
    <div className="kiosk-shell">
      <header className="topbar">
        <div className="brand">
          <BrandMark />
          <div className="brand__name">EZ Kyosk</div>
          <div className="brand__tagline">A little pause, beautifully served.</div>
        </div>
        <div className="topbar__actions">
          <span className="language-label">English</span>
          <button
            aria-label={`Open order with ${itemCount} items`}
            className="header-cart-button"
            onClick={() => setCartOpen(true)}
            type="button"
          >
            <Icon name="cart" size={25} />
            <span>{itemCount}</span>
          </button>
        </div>
      </header>

      <div className="kiosk-layout">
        <nav aria-label="Menu categories" className="category-nav">
          {categories.map((category) => (
            <button
              aria-current={activeCategory === category.id ? 'page' : undefined}
              className={activeCategory === category.id ? 'is-active' : ''}
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              type="button"
            >
              <Icon name={category.icon} size={27} />
              <span>{category.label}</span>
            </button>
          ))}
          <div aria-hidden="true" className="category-nav__ornament" />
        </nav>

        <main className="catalog">
          <div className="catalog__intro">
            <p className="eyebrow">Welcome to EZ Kyosk</p>
            <h1>What are you craving today?</h1>
            <p>Explore familiar favorites, thoughtfully prepared.</p>
          </div>

          <div className="catalog-tools">
            <label className="search-field">
              <Icon name="search" size={22} />
              <span className="sr-only">Search the menu</span>
              <input
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search our menu"
                type="search"
                value={searchQuery}
              />
            </label>
            <label className="sort-field">
              <span className="sr-only">Sort products</span>
              <select
                onChange={(event) => setSortOrder(event.target.value)}
                value={sortOrder}
              >
                <option value="popular">Most popular</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>

          <div className="catalog__heading">
            <div>
              <p className="eyebrow">Curated for you</p>
              <h2>{activeCategoryLabel}</h2>
            </div>
            <span>{visibleProducts.length} choices</span>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} onAdd={handleAdd} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <h3>No matches in {activeCategoryLabel}</h3>
              <p>Try another search or browse a different category.</p>
              <button onClick={() => setSearchQuery('')} type="button">Clear search</button>
            </div>
          )}
        </main>

        <CartPanel
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onReview={handleReview}
        />
      </div>

      <button
        aria-label="Open your order"
        className="mobile-order-bar"
        onClick={() => setCartOpen(true)}
        type="button"
      >
        <span className="mobile-order-bar__count">{itemCount}</span>
        <span>View order</span>
        <strong>{formatPHP(subtotalCentavos)}</strong>
      </button>
    </div>
  );
}

