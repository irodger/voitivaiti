import {text} from './localization';
const lines=[
['lead','Лид: «Ты какой-то выжатый. Может, возьмёшь несколько дней? Работа подождёт».','Your lead: “You look drained. How about a few days off? Work can wait.”'],
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
