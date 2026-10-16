import { text } from './localization';

type Pair = [string, string];
const dilemmas: Record<string, Pair> = {
  frontend: ['Быстро поправить один экран или разобраться, почему общий компонент ломает соседние?', 'Patch one screen quickly or find why a shared component breaks its neighbors?'],
  backend: ['Ответ потерялся. Повторить оплату или сначала узнать, что уже записано в базе?', 'The response was lost. Retry payment or first find what the database already recorded?'],
  mobile: ['Связи нет, а человек уже нажал оплату. Как сохранить действие и не создать второй заказ?', 'Connectivity is gone after Pay was tapped. How do you preserve the action without creating a second order?'],
  qa: ['Проверить больше устройств или сначала получить один случай, который команда точно повторит?', 'Cover more devices or first get one case the team can reliably reproduce?'],
  'qa-automation': ['До релиза восемь минут. Какие проверки защищают покупку, а какие только делают отчёт зелёным?', 'Eight minutes until release. Which checks protect checkout and which only turn the report green?'],
  designer: ['Человек не понимает, сколько заплатит. Поправить один экран или весь путь подтверждения?', 'The customer cannot tell what they will pay. Fix one screen or the whole confirmation journey?'],
  'ux-research': ['Пользователь хвалит макет, но не может закончить покупку. Чему довериться: словам или действиям?', 'A user praises the mockup but cannot finish checkout. Trust their words or their actions?'],
  analyst: ['Одна команда считает заказ оплаченным, другая — ожидающим. Кто и в какой момент меняет состояние?', 'One team sees a paid order, another sees a pending one. Who changes state, and when?'],
  'business-analyst': ['Возврат идёт через пять рук. Ускорить один шаг или убрать лишнюю передачу целиком?', 'A refund passes through five people. Speed up a step or remove an unnecessary handoff?'],
  product: ['Посещений больше, покупок меньше. Спасать текущую оплату или поддерживать продажи новой кампанией?', 'Traffic rises while purchases fall. Repair checkout or support sales with another campaign?'],
  project: ['Все обещали закончить к пятнице, но ждут друг друга. Как договориться о выполнимой последовательности?', 'Everyone promised Friday but is waiting on someone else. How do you agree a feasible sequence?'],
  delivery: ['Релиз готов не целиком. Выпустить безопасную часть или ждать связанный пакет изменений?', 'The release is only partly ready. Ship a safe slice or wait for the complete bundle?'],
  devops: ['Pipeline зелёный, а пользователи жалуются. Где граница между доставленной и работающей версией?', 'The pipeline is green but users complain. When is a delivered version actually working?'],
  sre: ['Вернуть старую версию целиком или изолировать сбой, сохранив новую функцию остальным?', 'Restore the old version for everyone or isolate the failure and keep the feature for others?'],
  sysadmin: ['Копия создана без ошибок. Хватит ли её, чтобы реально вернуть людям доступ к работе?', 'The backup finished without errors. Is it enough to actually restore people’s work?'],
  security: ['Доступ нужен сейчас, но широкие права останутся надолго. Как помочь, не открыть лишнее?', 'Access is needed now but broad permissions may linger. How do you help without overexposing data?'],
  'data-analyst': ['Средний показатель вырос. Улучшился продукт или просто поменялся состав пользователей?', 'The average rose. Did the product improve or did the user mix change?'],
  'data-engineer': ['Повторный запуск вернул пропущенные события и продублировал старые. Как отличить восстановление от порчи данных?', 'A rerun recovered missing events and duplicated old ones. How do you distinguish recovery from corrupting data?'],
  dba: ['Индекс ускорит чтение, но его построение задержит запись. Когда и как безопасно менять базу?', 'An index speeds reads but building it can delay writes. When and how do you change the database safely?'],
  'solution-architect': ['Быстро связать системы напрямую или сначала согласовать границы и ответственность за сбои?', 'Connect systems directly now or first agree boundaries and ownership when things fail?'],
  architect: ['Новая платформа обещает свободу. Стоит ли переносить всё сразу или проверить одну границу?', 'A new platform promises freedom. Migrate everything now or test one boundary first?'],
  support: ['Клиент просит просто починить. Как дать безопасный обход и не потерять обращение после передачи?', 'The customer just wants it fixed. How do you provide a safe workaround and keep ownership after escalation?'],
};
text('roleExperience.title', 'В чём твоя работа', 'What your work is about');
text('roleExperience.first', 'Первая рабочая история', 'Your first work story');
export const professionDilemma = Object.fromEntries(Object.entries(dilemmas).map(([id, pair]) => [id, text(`roleExperience.${id}`, ...pair)]));
