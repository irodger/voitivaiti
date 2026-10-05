import {text} from './localization';
[
 ['only','Новая работа сейчас недоступна. Сохранённые задачи и ответы коллег — ниже.','No new work is available right now. Saved tasks and colleague replies are below.'],
 ['wait','Подождать ответ · {minutes} мин','Wait for reply · {minutes} min'],
 ['waitNote','Это расходует игровое время, без опыта и улучшения проекта. Можно вместо этого взять другую работу.','This spends game time without experience or project improvements. You can take other work instead.'],
 ['ready','Ответ получен','Reply received'],['pending','Ждём коллегу','Waiting for a colleague'],['expected','Ожидаемый ответ: {date}, {time}','Expected reply: {date}, {time}'],
 ['minutes','Ещё {minutes} игровых минут','{minutes} game minutes remaining'],['waiting','Срок ответа подошёл; ждём результат коллеги.','The expected reply time has arrived; the colleague’s result is still pending.'],
 ['future','Ответ ожидается в другой календарный день. Его готовность проверяется при продвижении игрового календаря.','The reply is expected on a later calendar day. Its availability is checked when the game calendar advances.'],
 ['tip','Пока ждёшь, можно взять другую доступную работу. Реальное ожидание и чтение часы не двигают.','While waiting, you can take other available work. Waiting in real time and reading do not advance the clock.'],
 ['busy','Сначала заверши текущую работу или отложи её, если она тоже ждёт ответа.','First finish the current work, or pause it if it also depends on a reply.'],
 ['offDuty','Вернуться к задаче можно в рабочее время.','Resume this task during work hours.'],['saved','Задача сохранена','Task saved']
].forEach(([id,ru,en])=>text('waitingWork.'+id,ru,en));
