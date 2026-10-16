import { useState } from 'react';
import { useI18n } from '../content/localization';
import { GAME_VERSION } from '../content/releases';
import { checkForUpdate, usePwa } from '../pwa';
export function useVersionPanel(autoOpen: boolean) {
  const pwa = usePwa();
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(() => {
    if (!autoOpen) return false;
    try {
      return localStorage.getItem('voiti-vaiti-last-seen-version') !== GAME_VERSION;
    } catch {
      return true;
    }
  });
  const [tab, setTab] = useState('news');
  const close = () => {
    try {
      localStorage.setItem('voiti-vaiti-last-seen-version', GAME_VERSION);
    } catch {
      /* still allow closing */
    }
    setOpen(false);
  };
  const openVersion = () => {
    setOpen(true);
    void checkForUpdate();
  };
  return { openVersion, pwa, t, locale, open, setOpen, tab, setTab, close };
}
