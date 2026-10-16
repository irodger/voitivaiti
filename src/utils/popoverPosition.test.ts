import { describe, expect, it } from 'vitest';
import { popoverPosition } from './popoverPosition';

describe('popover placement', () => {
  const anchor = { left: 100, top: 250, bottom: 300 };
  const viewport = { width: 600, height: 500 };

  it('prefers below and clamps the right edge', () => {
    expect(
      popoverPosition({ ...anchor, left: 590 }, { width: 200, height: 100 }, viewport),
    ).toEqual({ left: 388, top: 308 });
  });

  it('flips above when the below clearance is exhausted', () => {
    expect(popoverPosition(anchor, { width: 200, height: 190 }, viewport)).toEqual({
      left: 100,
      top: 52,
    });
  });

  it('preserves different term and decision clearance at the boundary', () => {
    expect(popoverPosition(anchor, { width: 200, height: 188 }, viewport).top).toBe(308);
    expect(popoverPosition(anchor, { width: 200, height: 188 }, viewport, 12).top).toBe(54);
  });

  it('retains the minimum inset even when an overlay exceeds the viewport', () => {
    expect(
      popoverPosition({ left: -20, top: 5, bottom: 20 }, { width: 800, height: 600 }, viewport),
    ).toEqual({ left: 12, top: 12 });
  });
});
