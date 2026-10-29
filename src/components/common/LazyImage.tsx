import React, { useState, useEffect, useRef } from 'react';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g. '16/9', '4/3', '1/1', '21/9'
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  rootMargin?: string;
  fallbackSrc?: string;
}

/**
 * Specialized high-performance Image component wrapper:
 * - Employs Intersection Observer to defer image asset decoding until viewport proximity
 * - Enforces zero Cumulative Layout Shift (CLS) with dedicated aspect-ratio containers
 * - Displays a sleek cyber-LED blurred skeleton placeholder during loading
 * - Smoothly cross-fades the rendered image upon successful load
 * - Graceful fallback on broken image paths
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
  imgClassName = '',
  priority = false,
  rootMargin = '250px 0px',
  fallbackSrc = '/src/assets/images/hero_modern_studio_1790746375558.jpg',
  ...rest
}) => {
  const [isInView, setIsInView] = useState<boolean>(priority);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || isInView) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, isInView, rootMargin]);

  // Handle source changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const currentSrc = hasError ? fallbackSrc : src;
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached/complete
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [isInView, currentSrc]);

  return (
    <div
      ref={containerRef}
      style={{ aspectRatio }}
      className={`relative overflow-hidden w-full select-none ${className}`}
    >
      {/* 1. Blurred Shimmer Placeholder Box (Theme aware: crisp light slate or deep cyber-dark) */}
      <div
        className={`absolute inset-0 z-0 bg-slate-100 dark:bg-slate-950/80 border border-slate-200/60 dark:border-transparent transition-opacity duration-500 ease-out flex items-center justify-center ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Subtle animated shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse" />
        <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-cyan-500/30 border-t-cyan-600 dark:border-t-cyan-400 animate-spin opacity-50" />
      </div>

      {/* 2. Real Image (Loaded only when intersecting viewport or prioritized) */}
      {isInView && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (!hasError) {
              setHasError(true);
            }
          }}
          className={`w-full h-full object-cover object-center transition-all duration-500 ease-out ${
            isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-102 blur-xs'
          } ${imgClassName}`}
          {...rest}
        />
      )}
    </div>
  );
};
