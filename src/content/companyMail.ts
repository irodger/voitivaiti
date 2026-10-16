import { text } from './localization';
const copy = [
  ['title', 'Рабочая почта', 'Work mail'],
  ['inbox', 'Входящие', 'Inbox'],
  [
    'hint',
    'Письма сообщают о работе между командами. Чтение не выполняет задачу и не подтверждает её результат.',
    'Messages carry work context between teams. Reading does not complete a task or verify its result.',
  ],
  ['empty', 'Новых обращений пока нет', 'No team requests yet'],
  [
    'emptyHint',
    'Письма появятся, когда подразделение обратится к твоей команде по рабочей ситуации.',
    'Messages appear when a department contacts your team about actual work.',
  ],
  ['unread', 'Непрочитано', 'Unread'],
  ['read', 'Прочитано', 'Read'],
  ['markUnread', 'Пометить непрочитанным', 'Mark unread'],
  ['sent', 'Отправлено', 'Sent'],
  ['you', 'От тебя', 'From you'],
  ['to', 'Кому', 'To'],
  ['team', 'От команды', 'From team'],
  [
    'campaign',
    'Кампания: нужна проверка ожидаемого потока',
    'Campaign: expected traffic needs checking',
  ],
  ['request', 'Запрос владельцу нагрузки', 'Request to the capacity owner'],
  [
    'requestBody',
    'Переданы прогноз кампании и путь пользователя. Просим проверить запас нагрузки по зависимости команды продукта от владельца инфраструктуры.',
    'Campaign forecast and user journey were sent. Please verify capacity through the product team’s infrastructure dependency.',
  ],
  ['clarification', 'Уточнение условий проверки', 'Test conditions clarified'],
  ['result', 'Результат проверки нагрузки', 'Capacity check result'],
  ['handoff', 'Результат передан команде', 'Result handed to the team'],
  [
    'followup',
    'Незакрытая граница: нужно продолжить работу',
    'Open boundary: work needs to continue',
  ],
  ['review', 'Следующая проверка результата', 'Next result review'],
  ['resume', 'Открыть связанную работу', 'Open related work'],
  ['queue', 'К рабочей очереди', 'Go to work queue'],
  ['related', 'Связанная проблема', 'Related problem'],
  ['select', 'Выбери письмо, чтобы прочитать контекст', 'Select a message to read its context'],
  ['thread', 'Переписка по этой проблеме', 'Conversation about this problem'],
];
copy.forEach(([id, ru, en]) => text('mail.' + id, ru, en));
text('ui.mail', 'Почта', 'Mail');

const states = [
  [
    'active',
    'Эта работа уже начата. Вернись к сохранённому шагу.',
    'This work has started. Return to its saved step.',
  ],
  [
    'offDuty',
    'Сейчас вне смены. Продолжить работу можно в офисе.',
    'You are off duty. Work can continue at the office.',
  ],
  [
    'busy',
    'Сейчас выполняется другая задача. Сначала заверши или отложи её; связанная работа остаётся в очереди.',
    'Another task is active. Finish or pause it first; related work remains in the queue.',
  ],
  [
    'paused',
    'Работа отложена. Её состояние сохранено в очереди.',
    'Work is paused. Its state is saved in the queue.',
  ],
  [
    'waiting',
    'Результат передан. Последствия ещё ожидаются; письмо не запускает повторную проверку.',
    'The result was handed over. Consequences are still pending; this message does not restart the check.',
  ],
  [
    'completed',
    'Работа по этой проблеме завершена. Письмо остаётся в истории; новую задачу создавать не нужно.',
    'Work on this problem is complete. The message stays in history; no new task is needed.',
  ],
  [
    'queue',
    'Обращение сохранено в мире компании. Следующая работа выбирается в очереди с учётом незакрытых последствий.',
    'The request is saved in the company world. Next work is selected in the queue from unresolved consequences.',
  ],
];
states.forEach(([id, ru, en]) => text('mail.state.' + id, ru, en));
text('mail.previousResult', 'Переданный результат', 'Result handed over');

text('mail.earlier', 'Раньше', 'Earlier');
text('mail.later', 'Далее', 'Later');
