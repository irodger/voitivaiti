import {text} from './localization';
const copy:Record<string,[string,string]>={
 title:['Кто ждёт твою работу','Who is waiting for your work'],
 assigned:['Работа назначена','Work assigned'],waiting:['Ждёт внимания','Waiting for attention'],overdue:['Срок прошёл','Past the agreed date'],escalated:['Нужен разговор с Lead','A conversation with the lead is needed'],resolved:['Обязательство выполнено','Commitment fulfilled'],
 due:['Договорились вернуться: день {day}','Agreed return: day {day}'],
 postpone:['Договориться о переносе','Agree on a postponement'],blocker:['Объяснить, что мешает','Explain what is blocking progress'],defer:['Сообщить, что пока откладываешь','Say you are setting this aside for now'],
 'reply.postpone':['Коллега: «Перенос согласован. Я предупрежу тех, кто ждёт. Ещё один перенос потребует нового решения — работы или передачи».','Colleague: “The postponement is agreed. I will notify those waiting. Another delay needs a new decision: do the work or hand it over.”'],
 'reply.blocker':['Lead: «Ограничение понятно. Дадим день, чтобы разобраться вместе. Задача остаётся за тобой; можно открыть её и собрать данные».','Lead: “The constraint is clear. We have a day to investigate together. You still own the work; open it and gather evidence.”'],
 'reply.defer':['Коллега: «Спасибо, что сказал. Моя работа пока ждёт; срок не сдвинулся. Если очередь не разгрузится, придётся менять план релиза».','Colleague: “Thanks for telling me. My work is still waiting and the date has not moved. If the queue remains blocked, the release plan will change.”'],
 'reaction.waiting':['Коллега: «Я жду твою часть и не вижу статуса. Что мешает? Возьми работу, объясни ограничение или договорись о переносе».','Colleague: “I am waiting for your part without a status update. What is blocking it? Take the work, explain the constraint or agree on a postponement.”'],
 'reaction.explained':['Коллега: «Мы знаем об ограничении, но согласованный срок прошёл. Давай обновим следующий шаг; моя часть всё ещё заблокирована».','Colleague: “We know the constraint, but the agreed date passed. Update the next step; my part is still blocked.”'],
 'reaction.escalated':['Lead: «Работа всё ещё ждёт. Релизный план сдвигаем, а статус обсудим отдельно. Решим, кто и когда продолжит; зарплату за одну задачу не отменяем».','Lead: “The work is still waiting. We are moving the release plan and will discuss status separately. Decide who continues and when; one missing task does not cancel pay.”'],
};
Object.entries(copy).forEach(([id,pair])=>text('expect.'+id,...pair));
