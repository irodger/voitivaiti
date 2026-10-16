import type { EditorKind } from '../content/laptopTools';
import { appHasEvidence } from './appEvidence';
import type { LaptopWorkspace } from './useLaptopWorkspace';
type Input = Pick<LaptopWorkspace, 'board' | 'app' | 'task' | 'template' | 'view' | 'step'> & {
  world: Pick<LaptopWorkspace['world'], 'phase'>;
};
/** Header/journey visibility is separate from the screen routing decision. */
export function laptopPresentation(w: Input, editorKind: EditorKind) {
  const context =
    !w.board && w.app !== 'mail' && w.task && w.template && w.world.phase !== 'reward'
      ? { task: w.task, template: w.template, app: w.app }
      : null;
  const emptyReference =
    !!context &&
    !w.view &&
    context.app !== w.step?.app &&
    !appHasEvidence(context.task, context.app, editorKind);
  return { context, emptyReference };
}
