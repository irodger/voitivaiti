import type {RoleLens} from './roleLenses';

export const analysisLenses:RoleLens[]=[
 {id:'analyst',app:'ide',contribution:'preparation',
 inspect:['Проследить действие от экрана до сохранённого результата','Trace the action from screen to persisted result'],
 trace:['Сверить правила переходов и договорённости между системами','Compare transition rules and agreements between systems'],
 ask:['Передать требование без уточнения спорного состояния','Hand off the requirement without clarifying the disputed state'],
 missing:['Разработчик вернул два разных толкования требования. Оба соответствуют тексту, но дают разные результаты. Запиши спорный случай и проследи состояние операции.','The developer returned two interpretations. Both fit the text but produce different results. Record the disputed case and trace operation state.'],
 fast:['Описать временное правило для затронутого пути','Describe a temporary rule for the affected path'],
 care:['Согласовать общее правило переходов с владельцами систем','Agree on a shared transition rule with system owners'],
 check:['Пройти исходный случай, повтор и исключение по согласованным правилам','Walk through the original case, retry and exception using the agreed rules'],
 probe:[['Уточнить у владельца, кто подтверждает результат операции','Ask the owner who confirms the operation result'],['Экран показывает отправку, сервис подтверждает приём, хранилище — результат. Это разные события; владельцы указали, какое из них завершает действие.','The screen shows submission, the service confirms receipt, and storage records the result. These are different events; owners identified which completes the action.']],
 facts:{
 interface:['Экран скрывает действие для состояния «ожидает», а сервис считает его доступным. В договорённости не описано, что показывать на узком экране в этом состоянии.','The screen hides the action while pending, but the service considers it available. The agreement omits what a narrow screen should show in this state.'],
 payment:['Повтор запроса трактуется как новая операция. В правилах нет связи повтора с исходным результатом; клиент и сервис принимают разные решения.','A retry is treated as a new operation. Rules do not link it to the original result; client and service make different decisions.'],
 performance:['Один сервис ждёт полный список, другой возвращает его частями. В договорённости не указано, когда экран может показать первые данные.','One service waits for the full list while another returns parts. The agreement does not specify when the screen can show initial data.']},
 observations:{
 inspect:['Записаны состояние до действия, сообщение между системами и результат. Теперь видна точка, где правила расходятся.','The initial state, inter-system message and result are recorded. The point where rules diverge is now visible.'],
 fast:['Владелец подтвердил временное правило для одного пути. Остальные переходы ещё не согласованы; проверь исключение перед передачей.','The owner confirmed a temporary rule for one path. Other transitions remain unaligned; check an exception before handoff.'],
 care:['Владельцы согласовали переходы, повтор и исключение. Это спецификация для реализации; проверь её на конкретных примерах.','Owners agreed on transitions, retries and exceptions. This is an implementation specification; check it against concrete examples.'],
 limited:['Примеры проходят по временному правилу. Соседний путь остаётся спорным и записан отдельно; программное исправление ещё предстоит.','Examples fit the temporary rule. A neighboring path remains disputed and is recorded separately; software changes are still needed.'],
 shared:['Исходный случай, повтор и исключение дали однозначные результаты по правилам. Разработка и QA получили примеры; работающий продукт ещё нужно изменить и проверить.','The original case, retry and exception produce unambiguous results under the rules. Development and QA received examples; the running product still needs changes and verification.']}},
 {id:'business-analyst',app:'chat',contribution:'preparation',
 inspect:['Разобрать реальный случай с пользователем и владельцем процесса','Walk through a real case with the user and process owner'],
 trace:['Сопоставить нужный результат, потери и исключения процесса','Compare the intended result, losses and process exceptions'],
 ask:['Передать просьбу как готовое решение без уточнения цели','Hand off the request as a solution without clarifying the goal'],
 missing:['Исполнитель сделал то, что просили, но владелец не получил нужный результат. Просьба о кнопке не описывает цель процесса. Вернись к реальному случаю и выясни, что должно измениться.','The implementer did what was requested, but the owner did not get the intended result. A request for a button does not describe the process goal. Return to the real case and clarify what must change.'],
 fast:['Согласовать временный ручной путь и его цену','Agree on a temporary manual route and its cost'],
 care:['Согласовать результат и критерии приёмки со всеми участниками','Agree on the outcome and acceptance criteria with participants'],
 check:['Проверить обычный случай и исключение с участниками процесса','Check the normal case and an exception with process participants'],
 probe:[['Уточнить, кто принимает результат и кто разбирает исключение','Clarify who accepts the result and handles exceptions'],['Результат принимает владелец процесса, исключение разбирает поддержка. Их ожидания различались; оба участвуют в проверке будущего правила.','The process owner accepts the result and support handles exceptions. Their expectations differed; both take part in checking the proposed rule.']],
 facts:{
 interface:['Человеку нужно закончить заявку с телефона. Просьба «уменьшить форму» не учитывает обязательные сведения и возможность продолжить позже.','The person needs to finish an application on a phone. “Make the form smaller” overlooks required information and the ability to resume later.'],
 payment:['Повторный заказ создаёт ручную сверку и риск второго списания. Цель — одна подтверждённая покупка, а не просто более быстрая кнопка.','A duplicate order creates manual reconciliation and a risk of a second charge. The goal is one confirmed purchase rather than a faster button.'],
 performance:['Люди ждут весь отчёт, хотя для решения нужны первые строки. Владелец уточнил, какие данные обязательны и когда результат пригоден к работе.','People wait for the full report although the first rows support their decision. The owner clarified required data and when the result becomes usable.']},
 observations:{
 inspect:['Записаны цель человека, действия участников и место потери результата. Теперь можно проверить предложенное изменение на реальном процессе.','The person’s goal, participants’ actions and the lost outcome are recorded. The proposed change can now be checked against the real process.'],
 fast:['Участники согласовали ручной обход и ответственного. Он требует дополнительной работы; проверь, кому достаётся исключение.','Participants agreed on a manual workaround and an owner. It needs extra work; check who receives exceptions.'],
 care:['Согласованы нужный результат и признаки, по которым его примут — критерии приёмки. Пройди примеры с владельцем и поддержкой.','The outcome and signs used to accept it — acceptance criteria — are agreed. Walk through examples with the owner and support.'],
 limited:['Ручной путь позволяет закончить этот случай, но увеличивает нагрузку поддержки. Ограничение и ответственный записаны; причина ещё не устранена.','The manual route completes this case but increases support workload. Its limitation and owner are recorded; the cause remains.'],
 shared:['Владелец и поддержка подтвердили обычный случай и исключение по критериям. Команда получила проверяемую задачу; согласование не заменяет реализацию.','The owner and support confirmed normal and exceptional cases against the criteria. The team received a verifiable assignment; agreement does not replace implementation.']}}
];
