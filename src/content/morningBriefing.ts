import { text } from './localization';
const copy = [
  ['title', 'Продолжение прошлого рабочего дня', 'Continuing the previous workday'],
  [
    'from',
    'Итоги за {date}: передано результатов — {count}',
    'From {date}: {count} results delivered',
  ],
  ['ready', 'Ответ коллеги уже получен', 'The colleague’s reply has arrived'],
  ['waiting', 'Запрос ещё ждёт ответа', 'The request is still waiting for a reply'],
  ['carried', 'Продолжаем сохранённую работу', 'Continue the saved work'],
  ['returned', 'Появился новый повод продолжить', 'A new reason to continue has arrived'],
  [
    'none',
    'Новых обращений по переданным результатам пока нет.',
    'No new reports about the delivered results yet.',
  ],
  ['today', 'Согласованный срок сегодня', 'Agreed deadline is today'],
  ['overdue', 'Срок прошёл: нужен ответ коллеге', 'Overdue: a colleague needs a response'],
  ['deadlines', 'Обязательства на утро', 'Morning commitments'],
  [
    'hint',
    'После встречи — к задачам в ноутбуке. Ответы и сохранённая работа остаются там.',
    'After the meeting, open Tasks in the laptop for replies and saved work.',
  ],
];
copy.forEach(([id, ru, en]) => text('morningBrief.' + id, ru, en));

text(
  'morningBrief.open',
  'После переданного результата остаётся работа',
  'Work remains after the delivered result',
);
