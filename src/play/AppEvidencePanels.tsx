import { FileCode2, FolderOpen, Globe, MessageSquare, Search, Terminal } from 'lucide-react';
import type { EditorKind } from '../content/laptopTools';
import { useI18n } from '../content/localization';
import type { AppId } from '../world/types';
import { AppIllustration } from './AppIllustration';
import { ArtifactData } from './ArtifactData';
import { TermText } from './TermText';
import { Code } from './shared';
import type { AppEvidenceModel } from './useAppEvidence';
import { useEvidenceConsole } from './useEvidenceConsole';
import { useEvidenceEditor } from './useEvidenceEditor';

export function EvidenceRecords({ model }: { model: AppEvidenceModel }) {
  const { t } = useI18n();
  return (
    <div className="context-records">
      {model.visibleRecords.map(({ row, kind, title }, i) => (
        <article key={i}>
          <small>{t(title)}</small>
          <h3>{t(row.labelKey)}</h3>
          <ArtifactData row={row} kind={kind} />
        </article>
      ))}
    </div>
  );
}
export function EvidenceNotes({ model }: { model: AppEvidenceModel }) {
  const { t } = useI18n();
  return (
    <div className="context-notes">
      {model.visibleNotes.map((key, i) => (
        <article key={i}>
          <span className="context-index">{String(i + 1).padStart(2, '0')}</span>
          <p>
            <TermText>{t(key)}</TermText>
          </p>
        </article>
      ))}
    </div>
  );
}
export function EvidenceEmpty({
  app,
  titleKey,
  hintKey,
  editorKind = 'code',
}: {
  app: AppId;
  titleKey: string;
  hintKey: string;
  editorKind?: EditorKind;
}) {
  const { t } = useI18n();
  return (
    <div className="context-empty">
      <AppIllustration app={app} editorKind={editorKind} />
      <h3>{t(titleKey)}</h3>
      <p>{t(hintKey)}</p>
    </div>
  );
}
export function EvidenceEditor({ model: m }: { model: AppEvidenceModel }) {
  const { t, tool, Icon, code } = useEvidenceEditor();

  return (
    <div className={'context-editor' + (code ? '' : ' context-material-editor')}>
      <aside>
        <h3>
          {code ? <FolderOpen size={16} /> : <Icon size={16} />}{' '}
          {t(code ? 'appContext.structure' : 'tool.structure')}
        </h3>
        {m.relevant.map((s) => (
          <div key={s.id} className={s.id === m.step.id ? 'selected' : ''}>
            {code ? <FileCode2 size={15} /> : <Icon size={15} />}
            <span>{t(s.titleKey)}</span>
          </div>
        ))}
      </aside>
      <div className="context-editor-pane">
        <div className="context-toolbar">
          {code ? <FileCode2 size={16} /> : <Icon size={16} />}{' '}
          {code ? t('appContext.source') : tool.name}
        </div>
        {m.sources.length ? (
          <>
            <div
              className="evidence-source-tabs"
              role="group"
              aria-label={t('shelf.fragmentsTitle')}
            >
              {m.visibleSources.map(({ index }) => (
                <button
                  key={index}
                  aria-pressed={m.displayedSource?.index === index}
                  onClick={() => m.setSourceIndex(index)}
                >
                  <FileCode2 size={14} />
                  {t('shelf.fragment', { number: index + 1 })}
                </button>
              ))}
            </div>
            {m.displayedSource && <Code text={m.displayedSource.code} />}
          </>
        ) : (
          code && (
            <EvidenceEmpty
              app="ide"
              titleKey="appContext.noSource"
              hintKey="appContext.noSourceHint"
            />
          )
        )}
        <EvidenceRecords model={m} />
        <EvidenceNotes model={m} />
      </div>
    </div>
  );
}
export function EvidenceConsole({ model: m }: { model: AppEvidenceModel }) {
  const { t, tools, tool, Icon, code } = useEvidenceConsole();

  return (
    <div className={code ? 'context-terminal' : 'context-insights'}>
      <div className="context-toolbar">
        {code ? <Terminal size={17} /> : <Icon size={17} />}{' '}
        {code ? t('appContext.journal') : tool.name}
        <span>{m.notes.length + m.records.length}</span>
      </div>
      <div className="context-terminal-title">{t(m.template.titleKey)}</div>
      {m.empty ? (
        <EvidenceEmpty
          app="console"
          editorKind={tools.editorKind}
          titleKey={code ? 'appContext.noLogs' : 'tool.empty'}
          hintKey={code ? 'appContext.noLogsHint' : 'tool.emptyHint'}
        />
      ) : (
        <>
          {m.visibleSources.map(({ code, index }) => (
            <Code key={index} text={code} />
          ))}
          <EvidenceNotes model={m} />
          <EvidenceRecords model={m} />
        </>
      )}
    </div>
  );
}
export function EvidenceBrowser({ model: m }: { model: AppEvidenceModel }) {
  const { t } = useI18n();
  return (
    <div className="context-browser">
      <div className="context-toolbar">
        <Globe size={17} />
        <span>{t('appContext.preview')}</span>
      </div>
      <div className="context-address">
        <Search size={15} />
        {t(m.template.titleKey)}
      </div>
      <div className="context-browser-canvas">
        {m.empty ? (
          <EvidenceEmpty
            app="browser"
            titleKey="appContext.noPreview"
            hintKey="appContext.noPreviewHint"
          />
        ) : (
          <>
            <EvidenceRecords model={m} />
            <EvidenceNotes model={m} />
          </>
        )}
      </div>
    </div>
  );
}
export function EvidenceChat({ model: m }: { model: AppEvidenceModel }) {
  const { t } = useI18n();
  return (
    <div className="context-chat">
      <header>
        <MessageSquare size={22} />
        <div>
          <h3>{t('appContext.thread')}</h3>
          <p>{t(m.template.titleKey)}</p>
        </div>
      </header>
      {m.visibleMessages.map((s) => (
        <article className="context-message" key={s.id}>
          <small>{t(s.titleKey)}</small>
          <p>
            <TermText>{t(s.bodyKey)}</TermText>
          </p>
        </article>
      ))}
      <EvidenceNotes model={m} />
      <EvidenceRecords model={m} />
      {m.empty && m.completed.length === 0 && (
        <EvidenceEmpty
          app="chat"
          titleKey="appContext.noMessages"
          hintKey="appContext.noMessagesHint"
        />
      )}
    </div>
  );
}
