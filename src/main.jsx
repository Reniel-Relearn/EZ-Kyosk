import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { OrderTracking } from './components/OrderTracking';
import './styles/global.css';

function Root() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const updateRoute = () => setHash(window.location.hash);
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);

  return hash.startsWith('#track') ? (
    <OrderTracking token={hash.startsWith('#track=') ? hash.slice(7) : ''} />
  ) : (
    <CartProvider><App /></CartProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

