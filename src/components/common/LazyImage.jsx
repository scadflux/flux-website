import { useState, useEffect, useRef } from 'react';

/**
 * Lazy Loading Image Component
 * - Uses Intersection Observer for lazy loading
 * - Shows placeholder while loading
 * - Fade-in animation when loaded
 * - Improves page performance
 */
export default function LazyImage({
  src,
  alt,
  className = '',
  placeholder = '/assets/placeholder.png',
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    let observer;

    if (imgRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Load the image
              const img = new Image();
              img.src = src;
              img.onload = () => {
                setImageSrc(src);
                setImageLoaded(true);
              };

              // Stop observing once loaded
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before image enters viewport
        }
      );

      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} transition-opacity duration-500 ${
        imageLoaded ? 'opacity-100' : 'opacity-50'
      }`}
      loading="lazy" // Native lazy loading as fallback
      {...props}
    />
  );
}
