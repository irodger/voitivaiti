import { ArrowUpRight, Search } from 'lucide-react';
import '../content/evidenceShelf';
import '../content/workArtifacts';
import '../content/workspaceUx';
import type { AppId, Task } from '../world/types';
import './appContext.css';
import { AppIllustration } from './AppIllustration';
import './evidenceShelf.css';
import { Button } from './shared';
import { useAppContext } from './useAppContext';
import './workArtifact.css';

const emptyLabels = {
  ide: ['noSource', 'noSourceHint'],
  console: ['noLogs', 'noLogsHint'],
  browser: ['noPreview', 'noPreviewHint'],
  chat: ['noMessages', 'noMessagesHint'],
};
/** Shared evidence shell; each application owns its own presentation. */
export function AppContext({
  app,
  task,
  onContinue,
}: {
  app: AppId;
  task: Task;
  onContinue: () => void;
}) {
  const { t, tools, model, Panel, workApp, materialEditor, returnLabel } = useAppContext({
    app,
    task,
  });

  if (!model.hasEvidence) {
    const material = tools.editorKind !== 'code' && (app === 'ide' || app === 'console');
    const [title, hint] = emptyLabels[app];
    return (
      <section className={'app-context context-' + app + ' context-empty-reference'}>
        <div className="context-empty">
          <AppIllustration app={app} editorKind={tools.editorKind} />
          <h3>{t(material ? 'tool.empty' : 'appContext.' + title)}</h3>
          <p>{t(material ? 'tool.emptyHint' : 'appContext.' + hint)}</p>
          <Button onClick={onContinue}>{returnLabel}</Button>
        </div>
      </section>
    );
  }
  return (
    <section className={'app-context context-' + app}>
      <header className="evidence-shelf">
        <div>
          <small>{t('shelf.saved')}</small>
          <h3>{materialEditor ? tools.name(app) : t('shelf.' + app)}</h3>
        </div>
        <div className="evidence-counts">
          <span>{t('shelf.notes', { count: model.notes.length })}</span>
          <span>{t('shelf.records', { count: model.records.length })}</span>
          {app === 'ide' && (tools.editorKind === 'code' || model.sources.length > 0) && (
            <span>{t('shelf.fragments', { count: model.sources.length })}</span>
          )}
        </div>
        <label>
          <Search size={15} />
          <input
            value={model.query}
            onChange={(e) => model.setQuery(e.target.value)}
            placeholder={t('shelf.search')}
            aria-label={t('shelf.search')}
          />
          {model.query && (
            <button onClick={() => model.setQuery('')} aria-label={t('shelf.clear')}>
              ×
            </button>
          )}
        </label>
      </header>
      {model.noMatches && <p className="evidence-no-match">{t('shelf.noMatch')}</p>}
      <Panel model={model} />
      <div className="context-next">
        <ArrowUpRight size={20} />
        <p>{t(task.rewarded ? 'ui.readOnly' : 'artifact.contextHint', { app: workApp })}</p>
        <Button onClick={onContinue}>{returnLabel}</Button>
      </div>
    </section>
  );
}
