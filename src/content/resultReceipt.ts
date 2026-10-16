import { text } from './localization';
[
  ['steps', 'Пройдено этапов', 'Stages completed'],
  ['materials', 'Что осталось в материалах', 'What is in the work record'],
  ['notes', 'Наблюдения: {count}', 'Observations: {count}'],
  [
    'joke.temporary',
    'Скотч — тоже инженерное решение. Пока все помнят, где он приклеен.',
    'Duct tape is an engineering choice. As long as everyone remembers where it is.',
  ],
  [
    'joke.system',
    'Можно выдохнуть. Кнопка «сделать идеально навсегда» всё ещё в разработке.',
    'Take a breath. The “make it perfect forever” button is still in development.',
  ],
  [
    'joke.evidence',
    '«У меня работает» осталось мнением. Теперь у команды есть факты.',
    '“Works on my machine” stayed an opinion. The team now has facts.',
  ],
  [
    'joke.finished',
    'Ещё одна задача пережила встречу с реальностью. Кофе заслужен.',
    'Another task survived contact with reality. Coffee earned.',
  ],
].forEach(([id, ru, en]) => text('receipt.' + id, ru, en));
