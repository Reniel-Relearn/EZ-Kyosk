import { Icon } from './Icon';

export function OrderConfirmation({ orderNumber, onStartOver }) {
  return (
    <section aria-labelledby="confirmation-title" className="confirmation-screen">
      <div className="confirmation-card">
        <div className="confirmation-card__check">
          <Icon name="check" size={42} strokeWidth={2} />
        </div>
        <p className="eyebrow">Simulated confirmation</p>
        <h1 id="confirmation-title">Your order looks perfect.</h1>
        <p>
          This prototype created a local order preview only. Nothing was sent to a
          restaurant or payment provider.
        </p>
        <div className="confirmation-card__number">
          <span>Preview number</span>
          <strong>{orderNumber}</strong>
        </div>
        <button className="primary-button" onClick={onStartOver} type="button">
          Start a new order
        </button>
      </div>
    </section>
  );
}

