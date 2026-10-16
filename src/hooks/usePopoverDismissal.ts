import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react';

type Options = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  anchor: RefObject<HTMLElement | null>;
  popup: RefObject<HTMLElement | null>;
  closeOnScroll?: boolean;
  stopImmediateEscape?: boolean;
};

/** Shared event lifecycle; individual overlays retain their own markup and sizing. */
export function usePopoverDismissal({
  open,
  setOpen,
  anchor,
  popup,
  closeOnScroll = false,
  stopImmediateEscape = false,
}: Options) {
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const outside = (event: PointerEvent) => {
      if (
        !anchor.current?.contains(event.target as Node) &&
        !popup.current?.contains(event.target as Node)
      )
        close();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      if (stopImmediateEscape) event.stopImmediatePropagation();
      else event.stopPropagation();
      close();
      anchor.current?.focus();
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape, true);
    window.addEventListener('resize', close);
    if (closeOnScroll) document.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape, true);
      window.removeEventListener('resize', close);
      if (closeOnScroll) document.removeEventListener('scroll', close, true);
    };
  }, [open, setOpen, anchor, popup, closeOnScroll, stopImmediateEscape]);
}
