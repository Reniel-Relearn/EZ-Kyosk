import { useEffect, useState } from 'react';
import { Icon } from './Icon';

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(
    () => Boolean(document.fullscreenElement),
  );
  const [isSupported] = useState(
    () => typeof document.documentElement.requestFullscreen === 'function',
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setErrorMessage('');
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  async function handleToggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      setErrorMessage('Fullscreen is unavailable in this browser.');
    }
  }

  const label = isSupported
    ? isFullscreen
      ? 'Exit fullscreen'
      : 'Enter fullscreen'
    : 'Fullscreen unavailable';

  return (
    <>
      <button
        aria-label={label}
        aria-pressed={isFullscreen}
        className="fullscreen-button"
        disabled={!isSupported}
        onClick={handleToggleFullscreen}
        title={label}
        type="button"
      >
        <Icon name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} size={17} />
      </button>
      {errorMessage ? (
        <span className="fullscreen-status" role="status">
          {errorMessage}
        </span>
      ) : null}
    </>
  );
}
