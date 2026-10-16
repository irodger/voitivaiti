import { Files, CheckCircle2 } from 'lucide-react';
import type { Task, Step } from '../world/types';
import { useI18n } from '../content/localization';
import { TermText } from './TermText';
import '../content/resultReceipt';
/** Only already recorded observations; never future follow-up text. */
export function ResultMaterials({ task, steps }: { task: Task; steps: Step[] }) {
  const { t } = useI18n();
  const recorded = steps
    .filter((step) => task.progress[step.id]?.status === 'completed')
    .map((step) => ({
      step,
      notes: [...new Set(Object.values(task.progress[step.id].observations ?? {}))],
    }));
  if (!recorded.some((item) => item.notes.length)) return null;
  return (
    <details className="result-materials">
      <summary>
        <Files size={18} />
        {t('receipt.materials')}
        <span>{recorded.reduce((sum, item) => sum + item.notes.length, 0)}</span>
      </summary>
      <div>
        {recorded
          .filter((item) => item.notes.length)
          .map(({ step, notes }) => (
            <article key={step.id}>
              <h3>
                <CheckCircle2 size={15} />
                {t(step.titleKey)}
              </h3>
              <ol>
                {notes.map((key) => (
                  <li key={key}>
                    <TermText>{t(key)}</TermText>
                  </li>
                ))}
              </ol>
            </article>
          ))}
      </div>
    </details>
  );
}
