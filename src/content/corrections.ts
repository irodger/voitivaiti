import {text} from './localization';
const copy=[
['ready','Работа готова. Отправь результат и ограничения на проверку.','Your work is ready. Send the result and its constraints for review.'],
['accept','Принять решение','Commit decision'],
['missedTotal','В наблюдениях упущена итоговая сумма: она по-прежнему появляется слишком поздно. Человек до последнего не понимает, сколько заплатит. Добавим это в следующую правку.','The observations missed the total: it still appears too late. People cannot tell what they will pay. We will address this in the next revision.'],
['missed','В наблюдениях остался пробел. На следующей проверке команда вернулась к пропущенным случаям — это добавило работы.','There was a gap in the observations. The next check brought the team back to the missed cases, adding more work.'],
['closed','✓ Основная работа закрыта','✓ Main work complete'],['next','Что возьмёшь дальше?','What will you take next?'],['queue','Всё сегодня не успеть. Выбор повлияет на тех, кто ждёт работу.','Not everything fits today. Your choice affects the people waiting.'],
['role','Твоя роль','Your role'],['now','Сейчас: {state}','Now: {state}'],['home','рабочий день закончен','the workday is over'],['review','коллега смотрит MR','a colleague is reviewing your MR'],['qa','QA ждёт результата проверки','QA is waiting for the check result'],['work','команда работает','the team is working'],['queueState','основная работа закрыта · {count} дел ждут решения','main work complete · {count} items waiting'],['incident','команда разбирает инцидент','the team is handling an incident'],['update','Доступно обновление','Update available'],['available','Доступна версия: {version}','Available version: {version}'],['saveFailed','Не удалось сохранить прогресс. Обновление пока не применено.','Could not save progress. The update has not been applied.']
];copy.forEach(([id,ru,en])=>text('fix.'+id,ru,en));
text('ui.sendReview','Отправить на review','Send for review');

text('fix.updateAction','Обновить','Update');

text('fix.reply','пришёл ответ коллеги','a colleague has replied');
text('fix.readyReview','работа готова к отправке на review','work is ready to send for review');

text('fix.observations','Отметь, на что будешь опираться в своём решении.','Select the observations you will base your decision on.');
