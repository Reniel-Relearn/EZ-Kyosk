import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

function ImageContent({ src, srcSet, sizes, alt = '', className = '', wrapperClassName = '', priority = false, fetchPriority = 'auto' }) {
  const [status, setStatus] = useState('loading');
  const imageRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;
    // Cached responses can finish before React attaches its load listener.
    if (image?.complete) setStatus(image.naturalWidth > 0 ? 'loaded' : 'error');
  }, []);

  return (
    <span className={`menu-image ${wrapperClassName} is-${status}`} aria-busy={status === 'loading' ? true : undefined}>
      {status !== 'loaded' && (
        <span className="menu-image__placeholder" aria-hidden="true">
          <Icon name="coffee" size={28} />
          <span>{status === 'error' ? 'Photo unavailable' : 'Loading photo'}</span>
        </span>
      )}
      <img
        alt={alt}
        className={`menu-image__photo ${className}`}
        decoding="async"
        fetchPriority={fetchPriority}
        height="448"
        hidden={status === 'error'}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setStatus('error')}
        onLoad={() => setStatus('loaded')}
        ref={imageRef}
        sizes={sizes}
        src={src}
        srcSet={srcSet}
        width="400"
      />
    </span>
  );
}

export function ProductImage(props) {
  return <ImageContent key={props.src} {...props} />;
}
