import { useEffect, useState } from 'react';
import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
export function useMontagePlayback() {
  const w = useWorld();
  const { t } = useI18n();
  const result = w.life!.montage!;
  const [frame, setFrame] = useState(() =>
    matchMedia('(prefers-reduced-motion: reduce)').matches ? result.days : 0,
  );
  useEffect(() => {
    if (frame >= result.days) return;
    const timer = setTimeout(() => setFrame((n) => n + 1), Math.max(90, 650 - frame * 75));
    return () => clearTimeout(timer);
  }, [frame, result.days]);
  return { w, t, result, frame, setFrame };
}
