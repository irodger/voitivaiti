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
text('queue.reason.late','После 17:00 новую задачу уже не начать. Закончи день — завтра она снова будет доступна.','It is too late to start a new task after 17:00. Finish the day; it will be available again tomorrow.');
text('queue.reason.review','Сначала обсуди итоги работы с руководителем.','Discuss your performance with your lead first.');
text('queue.agree','Как сообщишь команде о смене приоритета?','How will you communicate the priority change?');

text('queue.pickHint','Нажми на работу, которую хочешь взять. Затем выбери, как сообщить о приоритете.','Select the work you want to take, then choose how to communicate the priority.');
text('queue.confirmHint','Теперь выбери ниже, как сообщить о приоритете — после этого можно начать.','Choose below how to communicate the priority, then you can start.');
text('queue.choose','Выбрать →','Select →');
text('queue.chosen','Выбрано','Selected');
text('queue.reason.pick','Сначала выбери карточку работы выше и подтверди приоритет.','First select a work card above and confirm the priority.');
text('queue.reason.sync','Сначала закончи утренний синк.','Finish the morning sync first.');
text('decision.orderSaved','Пойдёшь в таком порядке: {items}.','You will follow this order: {items}.');
text('decision.observationsSaved','Вот на что будешь опираться дальше: {items}.','Here is what you will build on: {items}.');
text('decision.allocationSaved','Ресурсы распределены: {items}.','Resources allocated: {items}.');

text('consequence.earlyReport','В твоём плане результат фиксируется до проверки соседнего сценария. В отчёте пока останется слепая зона — к ней, возможно, придётся вернуться.','Your plan records the result before checking the neighbouring case. That leaves a blind spot in the report you may need to revisit.');
text('consequence.incompletePlan','В план не вошло: {items}. Можно двигаться дальше, но эти проверки пока остаются за рамками работы.','The plan leaves out: {items}. You can continue, but these checks remain outside the work.');
text('consequence.reordered','Начнёшь с «{first}». Порядок изменён: на ранних шагах у тебя может ещё не быть результатов остальных проверок.','You will start with “{first}”. With this changed order, results from other checks may not yet be available at the early steps.');
text('consequence.coveredPlan','В плане есть и исходный случай, и остальные проверки. Будет на что опереться, когда станешь описывать результат.','The plan includes the original case and the remaining checks. You will have evidence to draw on when describing the result.');
text('consequence.missed','Пока без внимания осталось: {items}. Следующий шаг будет опираться на неполную картину; позже может понадобиться ещё одна проверка.','Still unexamined: {items}. The next step will rely on an incomplete picture; another check may be needed later.');
text('consequence.covered','Нужные для следующего шага наблюдения собраны. Теперь можно проверить, что с ними удастся изменить.','The observations needed for the next step are collected. Now you can see what they let you change.');
text('consequence.allocated','Распределение зафиксировано.','The allocation is recorded.');
text('consequence.uncovered','Без ресурсов осталось: {items}. Эти направления пока не продвинутся.','No resources went to: {items}. These areas cannot move forward yet.');
text('consequence.reserve','В запасе осталось {amount} — есть пространство для непредвиденной работы.','You have {amount} in reserve for unexpected work.');
text('consequence.noReserve','Свободного резерва нет: новое дело потребует пересмотреть распределение.','There is no spare capacity: new work will require reallocating resources.');
text('consequence.shortcut','Ты выбрал: «{choice}». Объём работы сейчас ограничен, но остаётся технический долг — его ещё придётся разбирать.','You chose: “{choice}”. The scope is limited for now, but technical debt remains to be addressed.');
text('consequence.foundation','Ты выбрал: «{choice}». Технического долга станет меньше; довести этот подход до результата ещё предстоит.','You chose: “{choice}”. This reduces technical debt; the approach still needs to be carried through.');
text('consequence.choice','Дальше работа пойдёт по выбранному варианту: «{choice}». Что получится, покажет следующая проверка.','The work will follow your chosen approach: “{choice}”. The next check will show how it works out.');

text('queue.start','Начать работу','Start work');

text('plan.reorderHelp','Все действия уже в плане. Нажми на действие, чтобы переместить его на первое место. Затем подтверди порядок.','All actions are included. Click an action to move it to the top, then confirm the order.');
text('plan.moveFirst','Переместить на первое место: {item}','Move to top: {item}');
text('plan.confirm','Подтвердить порядок','Confirm order');

text('focus.now','Сейчас','Now');
text('focus.task','Текущая задача','Current task');
text('focus.open','Открыть: {context}','Open: {context}');
text('focus.onboarding','Первый день · знакомство с командой','First day · meeting the team');
text('focus.home','Рабочий день окончен · время дома','Workday over · time at home');
text('focus.ended','Карьера завершена','Career complete');
text('focus.incident','В компании разбирают инцидент','An incident is being handled');
text('focus.performance','Руководитель ждёт разговора об итогах работы','Your lead is waiting to discuss your work');
text('focus.complete','Работа завершена · итоги готовы','Work complete · results are ready');
text('focus.blocked','{task} · работа приостановлена','{task} · work is on hold');
text('focus.reply','{task} · пришёл ответ коллеги','{task} · a colleague has replied');
text('focus.waiting','{task} · отправлено на review, ждём ответ','{task} · sent for review, awaiting a reply');
text('focus.ready','{task} · работа готова к review','{task} · ready for review');
text('focus.step','{task} · {step}','{task} · {step}');
text('focus.sync','Утренний синк · команда обсуждает день','Morning sync · the team is discussing the day');
text('focus.available','В очереди есть работа на сегодня','Work is available for today');
text('focus.queue','Основная работа закрыта · в очереди {count}','Main work complete · {count} queued');
text('focus.clear','Обязательная работа закончена','Required work is finished');
text('focus.ambient','В офисе идёт рабочий день','The workday is underway');
