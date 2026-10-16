import { useState } from 'react';
import { gameConfig } from '../config/game';
import { useMediaQuery } from '../hooks/useMediaQuery';
export function useActionPanel() {
  const [slot, setSlot] = useState<HTMLDivElement | null>(null);
  const wide = useMediaQuery(gameConfig.ui.desktopQuery);
  return { slot, setSlot, wide };
}
