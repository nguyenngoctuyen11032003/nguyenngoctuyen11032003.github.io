import { useEffect, type RefObject } from 'react';

/**
 * Marks the element with `data-far` while it is more than a screen away from the viewport, so CSS
 * can stop rendering a heavy pinned stage there (`content-visibility: hidden`). Off-screen layers
 * still cost the browser work on every frame of every other section; skipped ones cost nothing.
 * Only for stages with a fixed box (e.g. 100vh), so skipping them never shifts the layout. The
 * screen of margin lets a stage render again well before it scrolls into view.
 */
export function useFarSkip(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) delete el.dataset.far;
        else el.dataset.far = '';
      },
      { rootMargin: '100% 0px' }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      delete el.dataset.far;
    };
  }, [ref]);
}
