import { useLayoutEffect, type RefObject } from 'react';

/** Animate the existing view without remounting children or changing their state. */
export function useViewEntrance(ref: RefObject<HTMLElement | null>, view: string) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animation = element.animate([
      { opacity: .3, transform: 'translateY(7px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 180, easing: 'cubic-bezier(.2,.7,.2,1)' });
    return () => animation.cancel();
  }, [ref, view]);
}
