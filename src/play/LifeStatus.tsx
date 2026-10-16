import { Activity, ArrowUpRight } from 'lucide-react';
import '../content/corrections';
import '../content/mastery';
import '../content/recovery';
import { type FocusTarget } from './currentFocus';
import { useLifeStatus } from './useLifeStatus';

export function LifeStatus({ onOpen }: { onOpen?: (target: FocusTarget) => void } = {}) {
  const model = useLifeStatus({ onOpen });
  if (!model) return null;
  const { t, ch, l, event, label, open } = model;
  const content = (
    <>
      <Activity size={17} aria-hidden="true" />
      <span className="focus-copy">
        <small>{t('focus.now')}</small>
        <span className="current-status" title={label}>
          {label}
        </span>
      </span>
      {open && <ArrowUpRight size={17} aria-hidden="true" />}
    </>
  );
  return (
    <div className="life-status">
      {open ? (
        <button
          className="focus-bar"
          onClick={open}
          aria-label={t('focus.open', { context: label })}
        >
          {content}
        </button>
      ) : (
        <div className="focus-bar">{content}</div>
      )}
      {ch.stats.stress >= 70 && (
        <strong role="status">
          {t('life.warning' + (ch.stats.stress >= 95 ? 95 : ch.stats.stress >= 85 ? 85 : 70))}
        </strong>
      )}
      {event && event.until > l.calendarDay && (
        <span title={t('life.event.' + event.id + '.body')}>
          {t('life.event.' + event.id)} · {t('life.event.' + event.id + '.body')}
        </span>
      )}
      {l.salaryHeld > 0 && <strong>{t('life.payHeld', { amount: l.salaryHeld })}</strong>}
      {l.reviewDue && <strong>{t('life.review')}</strong>}
    </div>
  );
}
