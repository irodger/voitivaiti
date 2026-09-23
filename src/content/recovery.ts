import {text} from './localization';
const lines=[
['cream','Сливочный раф','Cream raf'],['lavender','Лавандовый раф','Lavender raf'],['banana','Банановый латте','Banana latte'],['pumpkin','Тыквенный раф','Pumpkin raf'],['flat','Флэт уайт','Flat white'],['cappuccino','Капучино','Cappuccino'],['iced','Айс-латте','Iced latte'],
['drink','За напитком · {price} ₽ · стресс −{relief}','Get a drink · ₽{price} · stress −{relief}'],
['quiet','Пятнадцать минут без уведомлений. Можно выдохнуть.','Fifteen minutes without notifications. Room to breathe.'],
['third','Коллега: «Уже третий? Может, сегодня лучше пораньше закрыть ноутбук». Следующий напиток стресс уже не снизит.','A colleague: “Third one? Maybe close the laptop earlier today.” Another drink will not reduce stress.'],
['reviewer','У кофемашины встретился коллега: «Твой MR видел. Допью и вернусь к проверке». Проверка пока ещё идёт.','A colleague at the coffee machine: “I saw your MR. Back to reviewing after this.” The review is still pending.'],
['blocked','QA у кофемашины: «Вижу, что задача заблокирована. После перерыва давай разберём инцидент».','QA at the coffee machine: “I see the blocker. Let us look at the incident after the break.”'],
['lead','Лид: «Ты какой-то выжатый. Может, возьмёшь несколько дней? Работа подождёт».','Your lead: “You look drained. How about a few days off? Work can wait.”'],
['company','Коллега рассказывает, как команда обсуждала новый релиз. Хорошо поговорить без созвона.','A colleague shares the release discussion. A conversation without a scheduled call.'],
['vacation','Взять отпуск · {days} рабочих дней','Take leave · {days} working days'],
['vacationHint','Команда продолжит работу. Твой текущий шаг сохранится. Зарплата и обычные расходы продолжаются; срочное личное обещание стоит передать коллеге.','The team keeps working. Your current step is saved. Pay and living costs continue; hand over urgent personal promises.'],
['return','Пока тебя не было…','While you were away…'],
['handoff','Личный срок прошёл: коллеге пришлось перестроить планы.','Your promised deadline passed; a colleague had to adjust their plans.'],
['reviewDone','Коллеги закрыли ожидавшее ревью.','The team completed the pending review.'],
['newBug','QA добавил проверку: баг в очереди теперь срочнее.','QA added a check: the queued bug is more urgent.'],
['projectMoved','Команда продвинула проект. Незаконченная личная задача ждёт на прежнем шаге.','The team advanced the project. Your unfinished task is waiting at the same step.'],
['burnout','Ты открываешь ноутбук и понимаешь: продолжать больше не можешь. Лид закрывает созвон: «Сейчас важнее ты. Работу мы подхватим». Эта карьера закончилась выгоранием. Её история останется в архиве.','You open the laptop and realise you cannot keep going. Your lead ends the call: “You matter more. We will take over.” This career ended in burnout. Its story remains in the archive.'],
['home','Рабочий день закончился, а голова всё ещё на работе. Одного вечера может быть мало — отпуск доступен ниже.','The workday is over, but your mind is still at work. One evening may not be enough; leave is available below.']
];lines.forEach(([id,ru,en])=>text('recovery.'+id,ru,en));

text('recovery.months','В карьере: {months} мес.','Career duration: {months} months');
