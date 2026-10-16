import { useEffect, useRef } from 'react';
import { useI18n } from '../content/localization';
export function useModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useI18n();
  useEffect(() => {
    ref.current?.showModal();
    return () => ref.current?.close();
  }, []);
  return { ref, t };
}
