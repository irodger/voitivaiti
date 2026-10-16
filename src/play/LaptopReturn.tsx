import { ArrowRight, Compass } from 'lucide-react';
import { text } from '../content/localization';
import type { Step } from '../world/types';
import './laptopReturn.css';
import { useLaptopReturn } from './useLaptopReturn';
text('laptopReturn.current', 'Текущая работа · {app}', 'Current work · {app}');
text('laptopReturn.back', 'К работе', 'Back to work');
export function LaptopReturn({ step, onReturn }: { step: Step; onReturn: () => void }) {
  const { t, tools } = useLaptopReturn();

  return (
    <aside className="laptop-return">
      <Compass size={19} aria-hidden="true" />
      <div>
        <small>{t('laptopReturn.current', { app: tools.name(step.app) })}</small>
        <b>{t(step.titleKey)}</b>
      </div>
      <button onClick={onReturn}>
        {t('laptopReturn.back')}
        <ArrowRight size={16} />
      </button>
    </aside>
  );
}
