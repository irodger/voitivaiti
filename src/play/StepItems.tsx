import { ArrowRight, Check, GripVertical } from 'lucide-react';
import { ActionDock } from './ActionDock';
import { Button } from './shared';
import { useStepItems, type Props } from './useStepItems';

/** Checklist, ordered plan and resource allocation share the same item layout. */
export function StepItems({ step, progress, disabled, consequential }: Props) {
  const model = useStepItems({ step, progress, consequential });
  if (!model) return null;
  const { dispatch, t, ordered, allocation, displayOrder, items, graph, instruction } = model;

  return (
    <>
      <p className="mechanic-instruction">{t(instruction, { budget: step.budget ?? 0 })}</p>
      <div
        className={`evidence-grid ${graph ? 'dependency-nodes' : ''} ${step.type === 'visual-compare' ? 'visual-options' : ''}`}
      >
        {items.map((item) => (
          <div
            className={`evidence-row ${!ordered && progress.draft.includes(item.id) ? 'selected' : ''}`}
            key={item.id}
          >
            {allocation ? (
              <>
                <label htmlFor={`allocation-${item.id}`}>{t(item.labelKey)}</label>
                <input
                  id={`allocation-${item.id}`}
                  type="number"
                  min="0"
                  max={step.budget}
                  value={progress.allocation[item.id] ?? 0}
                  disabled={disabled}
                  onChange={(e) =>
                    dispatch({ type: 'allocate', id: item.id, value: Number(e.target.value) })
                  }
                  aria-label={t('ui.amount', { item: t(item.labelKey) })}
                />
              </>
            ) : (
              <button
                disabled={disabled}
                onClick={() => dispatch({ type: 'draft', id: item.id })}
                aria-label={
                  ordered && !disabled ? t('plan.moveFirst', { item: t(item.labelKey) }) : undefined
                }
                aria-pressed={ordered ? undefined : progress.draft.includes(item.id)}
              >
                {ordered ? (
                  <span className="order-number">
                    {displayOrder.includes(item.id) ? (
                      displayOrder.indexOf(item.id) + 1
                    ) : (
                      <GripVertical size={16} />
                    )}
                  </span>
                ) : (
                  <span className="evidence-check">
                    {progress.draft.includes(item.id) && <Check size={15} />}
                  </span>
                )}
                <span>{t(item.labelKey)}</span>
                {graph && <ArrowRight size={18} />}
              </button>
            )}
          </div>
        ))}
      </div>
      {allocation && (
        <p className="allocation-count">
          {t('ui.allocated', {
            used: Object.values(progress.allocation).reduce((a, b) => a + b, 0),
            budget: step.budget ?? 0,
          })}
        </p>
      )}
      {!disabled && (
        <ActionDock>
          <Button onClick={() => dispatch({ type: 'submit' })}>
            {t(ordered ? 'plan.confirm' : consequential ? 'fix.accept' : 'ui.submitPlan')}
          </Button>
        </ActionDock>
      )}
    </>
  );
}
