import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';

function FoundationStatus() {
  return (
    <main className="foundation-status">
      <h1>EZ Kyosk</h1>
      <p>Phase 1 foundation is ready. Product prototyping has not started.</p>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FoundationStatus />
  </StrictMode>,
);

