import {
  Code2,
  Globe,
  Terminal,
  MessageSquare,
  Mail,
  Palette,
  NotebookPen,
  ChartNoAxesCombined,
  ClipboardList,
  LifeBuoy,
  Network,
  CheckCheck,
} from 'lucide-react';
import { useWorld } from '../world/store';
import { useI18n } from '../content/localization';
import { editorKindFor, laptopTool } from '../content/laptopTools';
import type { LaptopAppId } from '../play/laptopAppIds';
const icons = {
  code: Code2,
  globe: Globe,
  terminal: Terminal,
  chat: MessageSquare,
  mail: Mail,
  palette: Palette,
  notes: NotebookPen,
  chart: ChartNoAxesCombined,
  plan: ClipboardList,
  support: LifeBuoy,
  network: Network,
  checks: CheckCheck,
};
export function useLaptopTools() {
  const profession = useWorld(
      (s) => s.characters?.find((c) => c.id === s.activeCharacterId)?.profession ?? 'frontend',
    ),
    { t } = useI18n();
  const get = (app: LaptopAppId) => {
    const tool = laptopTool(profession, app);
    return { ...tool, name: t(tool.labelKey), purpose: t(tool.purposeKey), Icon: icons[tool.icon] };
  };
  return { editorKind: editorKindFor(profession), get, name: (app: LaptopAppId) => get(app).name };
}
