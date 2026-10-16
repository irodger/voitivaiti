import { text } from './localization';
import type { LaptopAppId } from '../play/laptopAppIds';
export type EditorKind =
  | 'code'
  | 'design'
  | 'research'
  | 'analysis'
  | 'product'
  | 'planning'
  | 'support'
  | 'architecture'
  | 'testing';
export type ToolIcon =
  | 'code'
  | 'globe'
  | 'terminal'
  | 'chat'
  | 'mail'
  | 'palette'
  | 'notes'
  | 'chart'
  | 'plan'
  | 'support'
  | 'network'
  | 'checks';
export type LaptopTool = { labelKey: string; purposeKey: string; icon: ToolIcon };
export const laptopAppOrder = ['ide', 'browser', 'console', 'chat', 'mail'] as const;
const defaults: Record<LaptopAppId, LaptopTool> = {
  ide: { labelKey: 'ui.ide', purposeKey: 'appPurpose.ide', icon: 'code' },
  browser: { labelKey: 'ui.browser', purposeKey: 'appPurpose.browser', icon: 'globe' },
  console: { labelKey: 'ui.console', purposeKey: 'appPurpose.console', icon: 'terminal' },
  chat: { labelKey: 'ui.chat', purposeKey: 'appPurpose.chat', icon: 'chat' },
  mail: { labelKey: 'ui.mail', purposeKey: 'mail.hint', icon: 'mail' },
};
const profileRoles: Record<string, EditorKind> = {
  designer: 'design',
  'ux-research': 'research',
  analyst: 'analysis',
  'business-analyst': 'analysis',
  'data-analyst': 'analysis',
  product: 'product',
  project: 'planning',
  delivery: 'planning',
  support: 'support',
  'solution-architect': 'architecture',
  architect: 'architecture',
  qa: 'testing',
};
const rows: [EditorKind, string, string, string, string, ToolIcon, string, string, ToolIcon][] = [
  [
    'design',
    'Figma',
    'Figma',
    'Макеты, компоненты и состояния интерфейса',
    'Layouts, components and interface states',
    'palette',
    'Проверки',
    'Checks',
    'checks',
  ],
  [
    'research',
    'Исследования',
    'Research',
    'Заметки, интервью и исследовательские материалы',
    'Notes, interviews and research material',
    'notes',
    'Наблюдения',
    'Findings',
    'chart',
  ],
  [
    'analysis',
    'Схемы и данные',
    'Data & models',
    'Правила, данные и связи системы',
    'System rules, data and relationships',
    'network',
    'Проверки',
    'Checks',
    'chart',
  ],
  [
    'product',
    'План продукта',
    'Product plan',
    'Гипотезы, приоритеты и продуктовые решения',
    'Hypotheses, priorities and product decisions',
    'plan',
    'Метрики',
    'Metrics',
    'chart',
  ],
  [
    'planning',
    'План проекта',
    'Project plan',
    'Планы, ресурсы и зависимости работы',
    'Plans, resources and work dependencies',
    'plan',
    'Зависимости',
    'Dependencies',
    'network',
  ],
  [
    'support',
    'Обращения',
    'Cases',
    'Обращения пользователей и материалы диагностики',
    'User cases and diagnostic material',
    'support',
    'Диагностика',
    'Diagnostics',
    'checks',
  ],
  [
    'architecture',
    'Схемы систем',
    'System design',
    'Границы систем, контракты и связи',
    'System boundaries, contracts and relationships',
    'network',
    'Проверки',
    'Checks',
    'checks',
  ],
  [
    'testing',
    'Тест-кейсы',
    'Test cases',
    'Сценарии, условия и результаты проверки',
    'Test scenarios, conditions and results',
    'checks',
    'Прогоны',
    'Test runs',
    'checks',
  ],
];
const profiles: Partial<Record<EditorKind, Partial<Record<LaptopAppId, LaptopTool>>>> = {};
for (const [kind, ru, en, purposeRu, purposeEn, icon, consoleRu, consoleEn, consoleIcon] of rows) {
  profiles[kind] = {
    ide: {
      labelKey: text('tool.' + kind, ru, en),
      purposeKey: text('tool.' + kind + '.purpose', purposeRu, purposeEn),
      icon,
    },
    console: {
      labelKey: text('tool.' + kind + '.console', consoleRu, consoleEn),
      purposeKey: text(
        'tool.' + kind + '.consolePurpose',
        'Сохранённые факты, результаты и ограничения',
        'Recorded facts, results and limitations',
      ),
      icon: consoleIcon,
    },
  };
}
profiles.design!.browser = {
  labelKey: text('tool.design.browser', 'Прототип', 'Prototype'),
  purposeKey: text(
    'tool.design.browserPurpose',
    'Пользовательский поток и проверка экранов',
    'User journeys and screen checks',
  ),
  icon: 'globe',
};
text('tool.empty', 'Материалов пока нет', 'No material yet');
text(
  'tool.emptyHint',
  'Здесь появятся материалы, которые ты изучишь в рабочих задачах.',
  'Material you inspect during work will appear here.',
);
text('tool.structure', 'Материалы задачи', 'Task material');
/** UI aliases keep the existing AppId and evidence routing stable across old saves. */
export function editorKindFor(profession: string): EditorKind {
  return profileRoles[profession] ?? 'code';
}
export function laptopTool(profession: string, app: LaptopAppId): LaptopTool {
  return profiles[editorKindFor(profession)]?.[app] ?? defaults[app];
}
