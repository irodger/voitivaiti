import { it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
vi.mock('../world/store', async (original) => {
  const actual = await original<typeof import('../world/store')>();
  return {
    ...actual,
    useWorld: Object.assign(
      (selector?: (s: ReturnType<typeof actual.useWorld.getState>) => unknown) =>
        selector ? selector(actual.useWorld.getState()) : actual.useWorld.getState(),
      actual.useWorld,
    ),
  };
});
import { useWorld } from '../world/store';
import { transition } from '../world/engine';
import { emptyCampaign, activeCharacter } from '../world/simulation';
import { advanceCalendar } from '../world/life';
import { WorkDesk } from './WorkDesk';
import { MailInbox } from './MailInbox';
import { LaptopNavigation } from './LaptopNavigation';
import { LaptopTaskbar } from './LaptopTaskbar';
it('shows an empty inbox safely and keeps Mail separate from mechanic steps', () => {
  const c = transition(emptyCampaign(), {
    type: 'new',
    name: 'Inbox',
    avatarId: '1',
    professionId: 'frontend',
    seed: 1427,
  }).campaign;
  useWorld.setState(c);
  expect(renderToStaticMarkup(<MailInbox onWork={() => {}} />)).toContain(
    'Новых обращений пока нет',
  );
  const nav = renderToStaticMarkup(
    <LaptopNavigation
      day={1}
      time={540}
      board={false}
      selectedApp="mail"
      unreadMail={2}
      onDesk={() => {}}
      onApp={() => {}}
    />,
  );
  expect(nav).toContain('Почта');
  expect(nav).toContain('laptop-mail-badge');
  expect(
    renderToStaticMarkup(
      <LaptopTaskbar
        board={false}
        selectedApp="mail"
        time={540}
        onDesk={() => {}}
        onApp={() => {}}
      />,
    ),
  ).toContain('aria-label="Почта"');
});
it('renders real department mail and unread state without mutating work on render', () => {
  const c = transition(emptyCampaign(), {
    type: 'new',
    name: 'Inbox',
    avatarId: '1',
    professionId: 'frontend',
    seed: 1427,
  }).campaign;
  delete activeCharacter(c).firstDay;
  while (c.life!.calendarDay < c.company!.structure!.campaign.plannedDay) advanceCalendar(c);
  useWorld.setState(c);
  const before = JSON.stringify(c),
    html = renderToStaticMarkup(<MailInbox onWork={() => {}} />);
  expect(html).toContain('Marketing');
  expect(html).toContain('Кампания: нужна проверка ожидаемого потока');
  expect(html).toContain('class="unread"');
  expect(renderToStaticMarkup(<WorkDesk onResume={() => {}} onInbox={() => {}} />)).toContain(
    'desk-mail',
  );
  expect(JSON.stringify(c)).toBe(before);
});
