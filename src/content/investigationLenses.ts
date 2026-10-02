import type {RoleLens} from './roleLenses';

export const investigationLenses:RoleLens[]=[
 {id:'qa-automation',app:'console',contribution:'validation',
 inspect:['Повторить проверку и сохранить шаги и журнал','Repeat the check and save its steps and log'],
 trace:['Сопоставить ожидания теста с состоянием продукта','Compare test expectations with product state'],
 ask:['Повторить упавший тест до зелёного результата','Rerun the failed test until it passes'],
 missing:['Следующий запуск зелёный, но журнал предыдущего падения остался. Один успех не объясняет нестабильность. Сохрани оба запуска и сравни условия.','The next run passes, but the earlier failure remains in the log. One success does not explain instability. Save both runs and compare conditions.'],
 fast:['Изолировать нестабильную проверку с ручной проверкой этого пути','Isolate the unstable check and manually verify this path'],
 care:['Сделать условия и ожидания проверки воспроизводимыми','Make check conditions and expectations reproducible'],
 check:['Повторить проверку в разных условиях и сверить с ручным результатом','Repeat under different conditions and compare with manual results'],
 probe:[['Запустить проверку с задержкой ответа','Run the check with a delayed response'],['При задержке тест завершает ожидание раньше продукта. В журнале есть момент проверки и момент ответа; можно сравнить их без догадок.','With a delay the test stops waiting before the product finishes. The log records check and response times so they can be compared.']],
 facts:{
 interface:['Проверка использует только широкий экран. На узком кнопка за рамкой, но тест проверяет её наличие, а не возможность нажать.','The check uses only a wide screen. On a narrow screen the button is outside the frame, but the test checks existence rather than usability.'],
 payment:['Тест ждёт фиксированное время и проверяет один ответ. Два запроса и две записи остаются незамеченными; проверять нужно сохранённый результат повтора.','The test waits a fixed time and checks one response. Two requests and two records go unnoticed; verify the persisted retry result.'],
 performance:['Маленький набор данных проходит быстро. На большом проверка обрывает ожидание и теряет причину задержки; нужны одинаковые данные и измерение времени.','A small dataset passes quickly. On a large one the check stops waiting and loses the delay cause; use matching data and measure time.']},
 observations:{
 inspect:['Сохранены успешный и упавший запуски. Теперь сравни данные, размер экрана и время ответа.','Passing and failing runs are saved. Compare data, viewport and response timing.'],
 fast:['Нестабильная проверка выделена отдельно; владелец и срок возврата записаны. Затронутый путь проверяется вручную, падения не скрыты.','The unstable check is isolated with an owner and return date. The affected path is checked manually; failures are not hidden.'],
 care:['Проверка ждёт наблюдаемого состояния и использует заданные данные. Теперь проверь, ловит ли она исходный сбой, а не просто становится зелёной.','The check waits for observable state and uses fixed data. Verify it catches the original failure rather than merely turning green.'],
 limited:['Ручная проверка подтвердила исходный случай. Автоматическое покрытие этого пути временно ограничено; это явно передано владельцу.','Manual verification confirmed the original case. Automated coverage of this path is temporarily limited and explicitly handed to its owner.'],
 shared:['На версии со сбоем проверка падает, на исправленной проходит; повторные запуски и соседний случай проверены. Разработчик получил доказательство, а не автоматический апрув релиза.','The check fails on the broken version and passes on the corrected one; repeated runs and a neighboring case were verified. The developer received evidence rather than automatic release approval.']}},
 {id:'ux-research',app:'browser',contribution:'discovery',
 inspect:['Наблюдать, как человек проходит проблемный путь','Observe a person using the problematic journey'],
 trace:['Сопоставить наблюдения и условия, в которых возникла трудность','Compare observations and the conditions of the difficulty'],
 ask:['Спросить только, нравится ли человеку экран','Ask only whether the person likes the screen'],
 missing:['Человек сказал, что экран симпатичный, но снова не закончил действие. Мнение о внешнем виде не объясняет затруднение. Попроси пройти путь и наблюдай без подсказки.','The person likes the screen but still cannot finish the action. An opinion about appearance does not explain the difficulty. Ask them to use the journey and observe without prompting.'],
 fast:['Передать наблюдение по этому случаю с ограничениями выборки','Share this case observation with sample limitations'],
 care:['Проверить объяснение на другом участнике и прототипе','Check the explanation with another participant and a prototype'],
 check:['Проверить, может ли человек закончить действие без подсказки','Check whether a person can finish without prompting'],
 probe:[['Уточнить цель человека перед началом действия','Ask about the person’s goal before the action'],['Человеку нужен результат операции, а не знакомство с экраном. Критерий наблюдения — завершённое действие без помощи исследователя.','The person needs the operation result rather than familiarity with the screen. Observe completion without researcher assistance.']],
 facts:{
 interface:['На телефоне человек не замечает продолжение формы за краем. После подсказки проходит, без неё останавливается: подсказка скрывала проблему.','On a phone the person misses the form continuation beyond the edge. They finish with a hint but stop without one: prompting concealed the problem.'],
 payment:['Человек нажимает повторно, потому что не видит подтверждения. Он не пытается сделать два заказа; экран не объясняет, принят ли первый.','The person clicks again because there is no confirmation. They do not intend two orders; the screen does not show whether the first was accepted.'],
 performance:['Во время ожидания человек решает, что действие не сработало, и начинает заново. Длительность ответа и непонятное ожидание — разные части проблемы.','While waiting the person assumes the action failed and starts over. Response duration and unclear waiting are different parts of the problem.']},
 observations:{
 inspect:['Записаны действия и остановки человека без подсказок. Это наблюдение одного случая; сравни его с условиями обращения.','Actions and stopping points were recorded without prompting. This is one case observation; compare it with the report conditions.'],
 fast:['Команда получила наблюдение одного участника и границы вывода. Оно помогает выбрать следующую проверку, но не доказывает поведение всех пользователей.','The team received one participant’s observation and its limits. It guides the next check but does not prove all users behave this way.'],
 care:['Подготовлен прототип с понятным ожиданием и продолжением. Другому участнику не объясняют, куда нажимать; проверяем самостоятельный путь.','A prototype clarifies waiting and continuation. Another participant is not told where to click; test their independent journey.'],
 limited:['Исходное затруднение повторилось без подсказки. Вывод ограничен этим случаем; команда получила запись и вопрос для следующего исследования.','The original difficulty recurred without prompting. The conclusion is limited to this case; the team received a recording and the next research question.'],
 shared:['Другой участник завершил путь в прототипе без подсказки. Гипотеза получила поддержку; реализация и проверка рабочего продукта ещё впереди.','Another participant completed the prototype journey without prompting. The hypothesis gained support; implementation and production verification are still ahead.']}}
];
