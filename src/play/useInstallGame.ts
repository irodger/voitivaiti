import { useEffect, useState } from 'react';
import { useI18n } from '../content/localization';
import {
  canSuggestInstall,
  dismissInstall,
  installMode,
  installPlatform,
  readInstallMemory,
  rememberInstalled,
} from '../installUx';
import { installApp, usePwa } from '../pwa';
export function useInstallGame(automatic: boolean, eligible: boolean) {
  const pwa = usePwa();
  const { t } = useI18n();
  const [hidden, setHidden] = useState(false);
  const [instructions, setInstructions] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState(false);
  const mode = installMode(pwa.installed, !!pwa.install, navigator, !automatic);
  useEffect(() => {
    if (pwa.installed) rememberInstalled();
  }, [pwa.installed]);
  useEffect(() => {
    if (!automatic) return;
    const check = () =>
      setDialog(!!document.querySelector('dialog[open],[role="dialog"][aria-modal="true"]'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['open'],
    });
    return () => observer.disconnect();
  }, [automatic]);
  if (
    mode === 'none' ||
    hidden ||
    (automatic &&
      (!eligible ||
        dialog ||
        !installPlatform(navigator).mobile ||
        !canSuggestInstall(readInstallMemory())))
  )
    return null;
  const close = () => {
    if (automatic) {
      dismissInstall();
      setHidden(true);
    } else setInstructions(false);
  };
  const act = async () => {
    if (mode === 'ios' || mode === 'manual') {
      setInstructions(true);
      return;
    }
    setBusy(true);
    const outcome = await installApp();
    setBusy(false);
    if (outcome === 'accepted') {
      rememberInstalled();
      setHidden(true);
    } else if (automatic) {
      dismissInstall();
      setHidden(true);
    }
  };
  return { t, instructions, busy, mode, close, act };
}
