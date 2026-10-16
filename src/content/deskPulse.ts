import { text } from './localization';
const copy = [
  ['focus', 'Сейчас', 'Now'],
  ['sync', 'Встреча команды', 'Team meeting'],
  ['review', 'Разговор об итогах', 'Performance discussion'],
  ['incident', 'Сначала разобраться с инцидентом', 'Address the incident first'],
  ['task', 'Продолжить работу', 'Continue work'],
  ['queue', 'Выбрать следующий шаг', 'Choose the next step'],
  ['offDuty', 'Рабочая смена закончена', 'Off duty'],
  ['answers', 'Ответы коллег', 'Colleague replies'],
  ['ready', 'Готово ответов: {count}', 'Replies ready: {count}'],
  ['awaiting', 'Ещё ждём: {count}', 'Still waiting: {count}'],
  ['noWaiting', 'Сохранённых ожиданий нет', 'No saved requests'],
  ['saved', 'Сохранено задач: {count}', 'Saved tasks: {count}'],
  ['choose', 'Можно выбрать', 'Available to choose'],
  ['queued', 'В очереди', 'Queued'],
  ['syncHint', 'План на утро — до новой задачи.', 'Morning planning comes before new work.'],
  [
    'reviewHint',
    'Сначала обсуди итоги с руководителем.',
    'Discuss performance with the lead first.',
  ],
  [
    'incidentHint',
    'Работа остановлена; реакция команды доступна в офисе.',
    'Work is blocked; team incident response is in the office.',
  ],
  ['taskHint', 'Сохранённый шаг. Без повторного старта.', 'The saved step. No restart required.'],
  [
    'queueHint',
    'Приоритет, условия и время — перед выбором.',
    'Priority, conditions and time come before choosing.',
  ],
  [
    'offDutyHint',
    'Задачи сохраняются до следующей смены.',
    'Work stays saved until the next shift.',
  ],
  ['blocked.current', 'После текущей работы', 'After the current work'],
  ['blocked.sync', 'После встречи команды', 'After the team meeting'],
  ['blocked.review', 'После разговора об итогах', 'After the performance discussion'],
  ['blocked.late', 'Поздно начинать новую работу', 'Too late to start new work'],
  ['blocked.offDuty', 'Вернёмся в рабочее время', 'Return during work hours'],
  ['blocked.empty', 'Новой работы пока нет', 'No new work available'],
  ['blocked.waiting', 'Сохранённые задачи — рядом', 'Saved work is nearby'],
  [
    'joke',
    'План дня: сначала понять. Потом героически исправлять.',
    'Today’s plan: understand first. Heroic fixes later.',
  ],
];
copy.forEach(([id, ru, en]) => text('deskPulse.' + id, ru, en));

text('deskPulse.savedLabel', 'Сохранённая работа', 'Saved work');
