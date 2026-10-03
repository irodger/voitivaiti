import {text} from './localization';
const rows=[
 ['mastery.path','Как получить этот опыт','How to gain this experience'],
 ['mastery.responsibility','Подтверждённые рабочие истории в текущем грейде','Confirmed work stories at this grade'],
 ['mastery.ambiguity','Исследовать неопределённость и проверить выбранный подход','Investigate uncertainty and validate an approach'],
 ['mastery.mentoringOrReview','Разобрать результаты совместной проверки или помочь коллеге','Discuss joint verification results or help a colleague'],
 ['mastery.delegationVariety','Получить результаты делегирования в разных контекстах','Receive delegation results in different contexts'],
 ['mastery.consequences','Разобраться с ограничением или результатом чужой работы','Handle a limitation or the result of another person’s work'],
 ['mastery.hint.autonomy','Нужны несколько самостоятельных работ. Исследуй проблему, проверь результат и передай его с границами проверки.','Complete several independent assignments: investigate, validate and hand over with test boundaries.'],
 ['mastery.hint.variety','Попробуй разные рабочие проблемы: интерфейс, оплату, нагрузку или зависимости. Повтор одного случая не заменяет разнообразие.','Work on different problems: interface, payments, load or dependencies. Repeating one case cannot replace variety.'],
 ['mastery.hint.planning','Выбирай объём работы и доводи его до проверки. Одно обещание ещё не считается завершённой историей.','Choose scope and validate the work. A promise alone is not a completed story.'],
 ['mastery.hint.cross-team','Передавай проверенный результат другому специалисту и получай ответ по этой работе.','Hand verified results to another specialist and receive their response.'],
 ['mastery.hint.production','Нужен опыт проблем оплаты, нагрузки или инцидентов. Исследование и согласованный результат тоже полезны.','Work through payment, load or incident problems. Investigation and agreed findings are useful too.'],
 ['mastery.hint.ownership','Пройди проблему от исследования до проверки и передачи результата, включая оставшиеся ограничения.','Own a problem from investigation to validation and handoff, including remaining limitations.'],
 ['mastery.hint.mentoringOrReview','Можно разобрать совместную проверку в обычной задаче, подключиться к review или помочь менее опытному коллеге в эпизоде после завершения работы. Наставничество не единственный путь.','Discuss joint verification during ordinary work, join a review or help a less experienced colleague in the post-task episode. Mentoring is not the only route.'],
 ['mastery.hint.delegation','Передай задачу и контекст коллеге. После его работы посмотри результат и прими его либо уточни следующий шаг. Назначение само по себе не считается.','Delegate a task with context. After the colleague works, review the result and accept it or clarify the next step. Assignment alone does not count.'],
 ['mastery.hint.prioritization','Объясни выбор работы и доведи её до результата; учитывай тех, кто ждёт остальную очередь.','Explain your priority and complete the work; consider those waiting for the remaining queue.'],
 ['mastery.hint.people','Нужны несколько результатов работы коллег, за которые ты отвечал и на которые отреагировал.','Take responsibility for several colleagues’ work results and respond to them.'],
 ['mastery.hint.consequences','Проверь границы временного решения, вернувшуюся проблему или результат делегирования.','Check a temporary solution’s boundaries, a returning problem or a delegated result.'],
 ['mastery.hint.responsibility','Нужны разные законченные истории в этом грейде. Ожидание, XP и многократное нажатие одной механики не заменяют опыт.','Complete different stories at this grade. Waiting, XP and repeated mechanic clicks do not replace experience.'],
 ['mastery.hint.ambiguity','Сопоставь наблюдения, выбери подход и проверь его в нескольких рабочих случаях.','Compare observations, choose an approach and validate it in several work situations.'],
 ['mastery.hint.delegationVariety','Передавай работу в разных контекстах, например проверку интерфейса и проблему оплаты.','Delegate in different contexts, such as an interface check and a payment problem.'],
 ['mastery.opportunity','После текущей работы можно вместе с коллегой проверить этот случай и объяснить границы результата.','After this assignment you can check the case with a colleague and explain its boundaries.'],
 ['responsibility.contextSent','Коллега получил задачу, наблюдения и границы ожидаемого результата.','The colleague received the task, observations and expected result boundaries.'],
 ['responsibility.title','Коллега вернулся с результатом','A colleague returned with a result'],
 ['responsibility.result.bounded','Коллега подготовил ограниченный результат и описал оставшийся риск. Это ещё не подтверждение исправления всей системы.','The colleague prepared a bounded result and described remaining risk. This does not confirm a repair of the whole system.'],
 ['responsibility.result.verified','Коллега повторил проверку, записал условия и передал результаты. Посмотри, достаточно ли их для следующего шага.','The colleague repeated the check, recorded conditions and shared findings. Review whether these support the next step.'],
 ['responsibility.accept','Принять результат с указанными границами','Accept the result with its boundaries'],
 ['responsibility.clarify','Вернуть на уточнение следующего шага','Request clarification of the next step'],
 ['responsibility.response.accept','Результат принят с границами; ответственность за следующий шаг понятна.','The result was accepted with boundaries; responsibility for the next step is clear.'],
 ['responsibility.response.clarify','Оставшаяся работа возвращена в очередь с уточнённым следующим шагом.','Remaining work returned to the queue with a clarified next step.'],
 ['absence.title','Перед отпуском: кто продолжит работу?','Before leave: who will continue the work?'],
 ['absence.hint','Сроки сами не сдвинутся. Передай контекст, договорись о переносе или оставь ожидание без ответа. Последний вариант доступен, но коллеги отреагируют.','Deadlines do not move by themselves. Hand over context, agree an extension or leave an expectation unanswered. The last option is allowed, but colleagues will respond.'],
 ['absence.handoff','Передать контекст: {name}','Hand over context to {name}'],
 ['absence.postpone','Согласовать перенос до возвращения','Agree an extension until return'],
 ['absence.ignore','Оставить без договорённости','Leave without an agreement'],
 ['absence.limits','Для срочной работы или уже перенесённого срока нужна передача либо выполнение. Повторный перенос не согласован.','Urgent work or an already extended deadline needs handoff or completion. Another extension is not agreed.'],
 ['absence.start','Уйти в отпуск на {days} рабочих дней','Take {days} working days off'],
 ['absence.agreed','Срок согласован до возвращения','Deadline agreed until return'],
 ['absence.notAgreed','Перенос или передача не состоялись; ожидание осталось без договорённости.','The extension or handoff did not happen; the expectation remains unagreed.'],
 ['absence.results','Пока тебя не было, коллега закончил работу. Результат ждёт твоей проверки.','While you were away, a colleague finished the work. The result awaits your review.']
];
rows.forEach(([id,ru,en])=>text(id,ru,en));
const names={bug:['QA ждал ответа по проблеме','QA waited for a response on the problem'],feature:['Product ждал обещанную работу','Product waited for the promised work'],review:['Коллега ждал review','A colleague waited for review'],debt:['Lead ждал ответа по техническому долгу','The lead waited for a response on technical debt'],support:['Поддержка ждала ответа пользователю','Support waited for a response to the user']};
for(const [id,[ru,en]] of Object.entries(names)){
 text('absence.waited.'+id,ru+': договорённости не было.',en+': there was no agreement.');
 text('absence.handed.'+id,ru+': контекст передан коллеге.',en+': context was handed to a colleague.');
 text('absence.moved.'+id,ru+': новый срок согласован до возвращения.',en+': a new deadline was agreed until return.');
}
