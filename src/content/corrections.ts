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

text('pwa.check.checking','Проверяем обновления…','Checking for updates…');
text('pwa.check.downloading','Загружаем обновление… Можно продолжать игру.','Downloading the update… You can keep playing.');
text('pwa.check.current','Установлена последняя доступная сборка.','The latest available build is installed.');
text('pwa.check.failed','Не удалось проверить или загрузить обновление. Проверь подключение и попробуй снова.','Could not check or download the update. Check your connection and try again.');
text('pwa.check.development','Это режим разработки: изменения приходят с локального сервера. Установленное приложение обновляется из опубликованной сборки.','Development mode: changes come from the local server. Installed apps update from the published build.');
text('pwa.check.retry','Проверить ещё раз','Check again');
text('pwa.check.applying','Применяем обновление…','Applying the update…');

text('queue.take','Взять задачу','Take task');
text('queue.action.bug','Разобраться вместе','Investigate together');
text('queue.action.feature','Доработать с коллегой','Work on it together');
text('queue.action.review','Сделать review','Review the work');
text('queue.action.debt','Привести в порядок','Clean it up');
text('queue.action.support','Ответить на запрос','Reply to the request');
text('queue.delegate','Передать: {name}','Delegate to {name}');
text('queue.delegated','Передано коллеге','Assigned to a colleague');
text('queue.reason.time','Сегодня не осталось времени на эту работу. Очередь сохранится на завтра.','There is not enough time today. This work will remain for tomorrow.');
text('queue.reason.late','После 17:00 новые самостоятельные задачи не начинаем.','No new individual tasks after 17:00.');
text('queue.reason.review','Сначала обсуди итоги работы с руководителем.','Discuss your performance with your lead first.');
text('queue.agree','Как сообщишь команде о смене приоритета?','How will you communicate the priority change?');
