type AnchorBounds = { left: number; top: number; bottom: number };
type Size = { width: number; height: number };

/** Keep anchored overlays inside the viewport, preferring the space below. */
export function popoverPosition(anchor: AnchorBounds, popup: Size, viewport: Size, clearance = 10) {
  return {
    left: Math.max(12, Math.min(anchor.left, viewport.width - popup.width - 12)),
    top: Math.max(12, anchor.bottom + popup.height + clearance < viewport.height
      ? anchor.bottom + 8
      : anchor.top - popup.height - 8),
  };
}
