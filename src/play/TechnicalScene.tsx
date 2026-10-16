import { ArrowRight, CheckCircle2, Clock3, FileCode2, MessagesSquare, Search } from 'lucide-react';
import '../content/timeClarity';
import '../content/workScenePolish';
import '../content/workspaceUx';
import type { Step, StepProgress } from '../world/types';
import { ActionDock } from './ActionDock';
import { Button, Code } from './shared';
import './taskScenes.css';
import { TermText } from './TermText';
import { useTechnicalScene } from './useTechnicalScene';
import { WorkArtifact } from './WorkArtifact';
import { WorkReplyStatus } from './WorkReplyStatus';
import './workScenePolish.css';

export function TechnicalScene({
  step,
  progress,
  readOnly,
}: {
  step: Step;
  progress: StepProgress;
  readOnly: boolean;
}) {
  const { t, dispatch, history, available } = useTechnicalScene({ step, progress });

  return (
    <div className="technical-scene">
      {step.code && <Code text={step.code} />}
      {!readOnly && <WorkReplyStatus step={step} progress={progress} />}{' '}
      {progress.dependency && !progress.dependency.ready && !readOnly && (
        <ActionDock>
          <Button secondary onClick={() => dispatch({ type: 'pause-task' })}>
            {t('story.pause')}
          </Button>
        </ActionDock>
      )}
      {history.length > 0 && (
        <div className="technical-observations" aria-label={t('action.observed')}>
          <div className="observation-journal-heading">
            <CheckCircle2 size={16} />
            <small>{t('action.observed')}</small>
            <span>{history.length}</span>
          </div>
          {history.length > 1 && (
            <details className="observation-history">
              <summary>{t('workspace.history', { count: history.length - 1 })}</summary>
              {history.slice(0, -1).map((action) => (
                <article key={action.id}>
                  <b>
                    <TermText>{t(action.labelKey)}</TermText>
                  </b>
                  <p>
                    <TermText>
                      {t(progress.observations?.[action.id] ?? action.observationKey)}
                    </TermText>
                  </p>
                  {action.artifact && (
                    <details>
                      <summary>{t(action.artifact.titleKey)}</summary>
                      <WorkArtifact action={action} progress={progress} readOnly />
                    </details>
                  )}
                </article>
              ))}
            </details>
          )}
          {history.slice(-1).map((action) => (
            <article key={action.id} className="latest-observation" aria-live="polite">
              <small className="latest-record-label">{t('workPolish.latest')}</small>
              <b>
                <TermText>{t(action.labelKey)}</TermText>
              </b>
              <p>
                <TermText>
                  {t(progress.observations?.[action.id] ?? action.observationKey)}
                </TermText>
              </p>
              {action.artifact && (
                <details>
                  <summary>{t(action.artifact.titleKey)}</summary>
                  <WorkArtifact action={action} progress={progress} readOnly />
                </details>
              )}
              {action.code && <Code text={action.code} />}
            </article>
          ))}
        </div>
      )}
      {!readOnly && progress.status !== 'completed' && (
        <ActionDock
          active={
            available.length > 0 &&
            available.length <= 2 &&
            available.every((action) => !action.artifact)
          }
        >
          <div className="technical-actions">
            <small>{t('action.next')}</small>
            {available.map((action) =>
              action.artifact ? (
                available.length === 1 ? (
                  <WorkArtifact key={action.id} action={action} progress={progress} />
                ) : (
                  <details key={action.id} className="artifact-action-option">
                    <summary>
                      <span>{t(action.labelKey)}</span>
                      <small>{t('action.minutes', { minutes: action.minutes })}</small>
                    </summary>
                    <WorkArtifact action={action} progress={progress} />
                  </details>
                )
              ) : (
                <button
                  key={action.id}
                  className="scene-action"
                  data-action-kind={
                    action.dependency
                      ? 'dependency'
                      : action.code
                        ? 'code'
                        : action.completes
                          ? 'result'
                          : 'explore'
                  }
                  onClick={() => dispatch({ type: 'technical-action', id: action.id })}
                >
                  <span className="scene-action-icon" aria-hidden="true">
                    {action.dependency ? (
                      <MessagesSquare size={22} />
                    ) : action.code ? (
                      <FileCode2 size={22} />
                    ) : action.completes ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <Search size={22} />
                    )}
                  </span>
                  <span className="scene-action-label">
                    {t(action.labelKey)}
                    <small>
                      <Clock3 size={12} />
                      {t('action.minutes', { minutes: action.minutes })}
                    </small>
                  </span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              ),
            )}
          </div>
        </ActionDock>
      )}
      <p className="work-scene-joke">{t('workPolish.joke')}</p>
    </div>
  );
}
