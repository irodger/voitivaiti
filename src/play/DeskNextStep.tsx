import '../content/progressionUx';
import '../content/waitingWork';
import './deskNextStep.css';
import { PerformancePanel } from './PerformancePanel';
import { Button } from './shared';
import { useDeskNextStep } from './useDeskNextStep';
export function DeskNextStep({ onOffice }: { onOffice?: () => void }) {
  const { w, t, state, canEnd } = useDeskNextStep();

  return (
    <div className="desk-next-step">
      {state.reason === 'review' ? (
        <PerformancePanel />
      ) : state.reason === 'empty' ? (
        <>
          <h3>{t('flow.empty')}</h3>
          <p>{t('flow.emptyBody')}</p>
          {state.locked > 0 && <p>{t('flow.locked', { count: state.locked })}</p>}
        </>
      ) : state.reason === 'waiting' ? (
        <p>{t('waitingWork.only')}</p>
      ) : state.reason === 'offDuty' ? (
        <p>{t('flow.offDuty')}</p>
      ) : null}
      {state.pending[0] && onOffice && (
        <>
          <p>{t('flow.pending', { event: t(state.pending[0].key) })}</p>
          <Button secondary onClick={onOffice}>
            {t('flow.office')}
          </Button>
        </>
      )}
      {canEnd && (
        <Button
          secondary
          onClick={() => {
            w.dispatch({ type: 'end-day' });
            onOffice?.();
          }}
        >
          {t('flow.finish')}
        </Button>
      )}
    </div>
  );
}
