import { useEffect, useMemo, useState } from 'react';
import logo from '../assets/b1t1/optimized/brand-logo.webp';
import { products } from '../data/menu';
import { formatPHP } from '../domain/money';
import { getTrackingProgress, readTrackingToken } from '../domain/tracking';
import { Icon } from './Icon';

const stages = [
  { id: 'received', label: 'Received', description: 'Your demo order is in.' },
  { id: 'preparing', label: 'Preparing', description: 'We’re preparing your order.' },
  { id: 'ready', label: 'Ready for pickup', description: 'Please collect at the counter.' },
];

export function OrderTracking({ token }) {
  const order = useMemo(() => {
    try { return readTrackingToken(token, products); } catch { return null; }
  }, [token]);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const refresh = () => setNow(Date.now());
    refresh();
    const timer = window.setInterval(refresh, 1000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [token]);

  const menuUrl = import.meta.env.BASE_URL;
  if (!order) {
    return (
      <main className="tracking-screen">
        <div className="tracking-page">
          <img alt="B1T1 Takeaway Coffee" className="tracking-logo" decoding="async" height="69" src={logo} width="640" />
          <section className="tracking-surface tracking-error">
            <p className="eyebrow">Order tracking</p>
            <h1>This link isn’t available.</h1>
            <p>Please scan the QR on your confirmation screen again.</p>
            <a className="primary-button" href={menuUrl}>Back to the menu</a>
          </section>
        </div>
      </main>
    );
  }

  const progress = getTrackingProgress(order.timestamp, order.queueAhead, now);
  const activeStage = stages.findIndex((stage) => stage.id === progress.status);
  const ready = progress.status === 'ready';

  return (
    <main className="tracking-screen">
      <div className="tracking-page">
        <header className="tracking-header">
          <img alt="B1T1 Takeaway Coffee" className="tracking-logo" decoding="async" height="69" src={logo} width="640" />
          <span className="demo-pill">Presentation demo</span>
        </header>
        <section className={`tracking-surface tracking-status ${ready ? 'is-ready' : ''}`}>
          <p className="eyebrow">A little closer to your coffee</p>
          <p className="tracking-reference">Demo order <strong>{order.id}</strong></p>
          <div aria-live="polite" aria-atomic="true" className="tracking-status__message">
            <div aria-hidden="true" className="tracking-status__icon">
              <Icon name={ready ? 'check' : 'coffee'} size={38} />
            </div>
            <h1>{stages[activeStage].label}</h1>
            <p>{stages[activeStage].description}</p>
          </div>
          <ol aria-label="Order progress" className="tracking-steps">
            {stages.map((stage, index) => (
              <li aria-current={index === activeStage ? 'step' : undefined}
                className={index <= activeStage ? 'is-reached' : ''} key={stage.id}>
                <span aria-hidden="true">{index < activeStage ? '✓' : index + 1}</span>
                {stage.label}
              </li>
            ))}
          </ol>
          <div className="tracking-queue" aria-live="polite" aria-atomic="true">
            <strong>{ready ? 'Your demo order is ready' : progress.ordersAhead > 0
              ? `${progress.ordersAhead} sample ${progress.ordersAhead === 1 ? 'order' : 'orders'} ahead`
              : progress.status === 'received' ? 'You’re first in line' : 'Your order is being prepared'}</strong>
            <span>{ready ? 'Show your order reference at pickup.' : 'Simulated queue · updates automatically'}</span>
            {order.queueAhead === 3 && !ready ? (
              <ol className="tracking-sample-queue" aria-label="Sample queue">
                {Array.from({ length: progress.ordersAhead }, (_, index) => (
                  <li key={index}>Sample {order.queueAhead - progress.ordersAhead + index + 1}</li>
                ))}
                <li className="is-yours">Your order</li>
              </ol>
            ) : null}
          </div>
        </section>
        <section className="tracking-surface tracking-summary" aria-labelledby="tracking-summary-title">
          <h2 id="tracking-summary-title">Your order</h2>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                <span className="tracking-quantity">{item.quantity}×</span>
                <div><h3>{item.name}</h3>{item.variantLabel && <p>{item.variantLabel}</p>}</div>
                <strong>{formatPHP(item.lineTotalCentavos)}</strong>
              </li>
            ))}
          </ul>
          <div className="tracking-total"><span>Total</span><strong>{formatPHP(order.totalCentavos)}</strong></div>
        </section>
        <p className="tracking-disclaimer">Demo — simulated progress. No payment was taken and no order was sent to B1T1. This page does not show a live kitchen queue.</p>
        <a className="tracking-menu-link" href={menuUrl}>Browse the menu</a>
      </div>
    </main>
  );
}
