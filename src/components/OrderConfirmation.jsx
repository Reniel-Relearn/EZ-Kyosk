import { useMemo, useState } from 'react';
import logo from '../assets/b1t1/brand-logo.png';
import { products } from '../data/menu';
import { createTrackingUrl } from '../domain/tracking';
import { Icon } from './Icon';
import { TrackingQr } from './TrackingQr';

export function OrderConfirmation({ order, onStartOver }) {
  const [queueAhead, setQueueAhead] = useState(0);
  const trackingUrl = useMemo(() => createTrackingUrl(
    order,
    products,
    new URL(import.meta.env.BASE_URL, window.location.origin).href,
    queueAhead,
  ), [order, queueAhead]);

  return (
    <section aria-labelledby="confirmation-title" className="confirmation-screen">
      <div className="confirmation-card confirmation-card--qr">
        <img alt="B1T1 Takeaway Coffee" className="confirmation-logo" src={logo} />
        <div className="confirmation-card__check">
          <Icon name="check" size={42} strokeWidth={2} />
        </div>
        <p className="eyebrow">B1T1 presentation confirmation</p>
        <h1 id="confirmation-title">Your B1T1 order looks perfect.</h1>
        <p>
          Scan with your phone camera to follow your demo order.
        </p>
        <section className="confirmation-qr" aria-labelledby="qr-heading">
          <h2 id="qr-heading">Scan to track your order</h2>
          <TrackingQr value={trackingUrl} />
          <a className="tracking-preview-link" href={trackingUrl} rel="noopener noreferrer" target="_blank">
            Open tracking preview
          </a>
        </section>
        <div className="confirmation-card__number">
          <span>Demo pickup reference</span>
          <strong>{order.id}</strong>
        </div>
        <fieldset className="demo-queue-control">
          <legend>Presentation queue</legend>
          <label><input checked={queueAhead === 0} name="demo-queue" onChange={() => setQueueAhead(0)} type="radio" /> First in line · 30 seconds</label>
          <label><input checked={queueAhead === 3} name="demo-queue" onChange={() => setQueueAhead(3)} type="radio" /> 3 sample orders ahead · 60 seconds</label>
        </fieldset>
        <p className="confirmation-demo-note">Demo — simulated progress, timed from confirmation. Nothing was sent to B1T1 and no payment was taken.</p>
        <button className="primary-button" onClick={onStartOver} type="button">
          Start a new order
        </button>
      </div>
    </section>
  );
}

