import { AnimatePresence, motion } from 'framer-motion';
import { FirstRunGuide } from './FirstRunGuide';
import { LaptopAppHeader } from './LaptopAppHeader';
import { LaptopScreen } from './LaptopScreen';
import { TaskJourney } from './StageJourney';
import { WorkClock } from './WorkClock';
import { useLaptopContent } from './useLaptopContent';
import type { LaptopWorkspace } from './useLaptopWorkspace';
export function LaptopContent({ workspace: w }: { workspace: LaptopWorkspace }) {
  const { context, emptyReference, closeLaptop } = useLaptopContent(w);
  return (
    <>
      <WorkClock onFinish={closeLaptop} />
      <FirstRunGuide compact />
      {context && (
        <TaskJourney
          compact
          task={context.task}
          steps={context.template.steps}
          selectedId={w.view?.id ?? w.step?.id ?? ''}
          onSelect={w.selectStep}
        />
      )}
      {context && (
        <LaptopAppHeader
          emptyReference={emptyReference}
          onCurrent={w.returnCurrent}
          app={w.view?.app ?? context.app}
          task={context.task}
          steps={context.template.steps}
          view={w.view}
          onDesk={w.openDesk}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={w.animationKey}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <LaptopScreen workspace={w} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
