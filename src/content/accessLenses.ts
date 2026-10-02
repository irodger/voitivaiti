import type {RoleLens} from './roleLenses';

export const accessLenses:RoleLens[]=[
 {id:'sysadmin',app:'console',contribution:'preparation',
 inspect:['Проверить доступность, учётную запись и журнал отказа','Check availability, the account and the failure log'],
 trace:['Проследить доступ через устройство, группу и сервис','Trace access through the device, group and service'],
 ask:['Перезапустить затронутый сервис в тестовом окружении','Restart the affected service in the test environment'],
 missing:['После перезапуска соединение восстановилось, но отказ повторился с той же учётной записью. Записано время проверки; теперь сопоставь разрешения и журнал отказа.','The connection recovered after restart, but the same account still gets the failure. The check time is recorded; compare permissions with the failure log.'],
 fast:['Подготовить временный доступ только к нужному ресурсу','Prepare temporary access to the required resource only'],
 care:['Подготовить изменение группы и проверку отзыва доступа','Prepare a group change and an access-revocation check'],
 check:['На тестовой учётной записи проверить работу и границы доступа','Check functionality and access boundaries with a test account'],
 probe:[['Повторить действие с другой тестовой учётной записью','Repeat with another test account'],['Другая запись проходит тот же путь. Устройства достигают сервиса; различие находится в назначенных группах, а не в доступности всей системы.','The other account completes the same journey. Devices reach the service; the difference lies in assigned groups rather than overall availability.']],
 facts:{
 interface:['Мобильная сессия получает новую группу, в которой нет доступа к продолжению формы. Desktop использует прежнюю группу; уменьшение экрана не исправит права.','Mobile sessions receive a new group without access to form continuation. Desktop uses the previous group; shrinking the screen will not fix permissions.'],
 payment:['Сервисная запись может отправить операцию, но не прочитать её результат. Повтор выглядит как новая попытка; нужны согласованные права на оба действия.','The service account can submit an operation but cannot read its result. A retry appears new; both actions need aligned permissions.'],
 performance:['Обновление группы убрало доступ к быстрому ресурсу. Сервис повторяет отказ и переходит к медленному пути; журнал объясняет задержку.','A group update removed access to a fast resource. The service retries the denied request and falls back to a slow route; the log explains the delay.']},
 observations:{
 inspect:['Сервис доступен, отказ привязан к конкретной записи и ресурсу. Сохранены время и код отказа; проследи назначенные права.','The service is available; the failure is tied to an account and resource. Time and error code are saved; trace assigned permissions.'],
 fast:['На тестовой записи подготовлен узкий временный доступ с владельцем и сроком отзыва. Рабочие права ещё не менялись.','Narrow temporary access is prepared on a test account with an owner and revocation date. Production permissions are unchanged.'],
 care:['Изменение группы подготовлено с планом применения и возврата. Проверь нужное действие и запрет на соседний ресурс.','The group change is prepared with application and rollback plans. Check the required action and denial of a neighboring resource.'],
 limited:['На тестовой записи нужное действие проходит, соседний ресурс закрыт. Временный доступ нужно отозвать в согласованный срок; общий порядок ещё требует изменения.','The required action passes on the test account and the neighboring resource is denied. Temporary access needs timely revocation; the general process still needs a change.'],
 shared:['На тестовой записи проверены действие, соседний запрет и отзыв доступа. Владелец получил план применения; тест не выдаётся за изменение рабочих прав.','The test account passed the action, neighboring denial and access revocation. The owner received the application plan; testing is not presented as changed production permissions.']}},
 {id:'security',app:'console',contribution:'preparation',
 inspect:['Сопоставить обращение с журналом доступа без секретов','Compare the report with access logs without collecting secrets'],
 trace:['Проверить границу защиты и влияние правила на обычное действие','Check the protection boundary and rule impact on normal activity'],
 ask:['На копии усилить общее правило блокировки','Tighten the general blocking rule on a copy'],
 missing:['В тесте правило остановило подозрительный запрос и обычное действие. Защита стала строже, но люди потеряли нужный путь. Сохрани оба случая и уточни границу правила.','In testing the rule stopped both a suspicious request and normal activity. Protection tightened, but people lost a required journey. Save both cases and refine the rule boundary.'],
 fast:['Подготовить точечное ограничение с наблюдением и сроком пересмотра','Prepare a targeted restriction with monitoring and a review date'],
 care:['Подготовить правило по состоянию операции и необходимым правам','Prepare a rule based on operation state and required permissions'],
 check:['На тестовых данных проверить обычный путь и запрещённое действие','Check normal and prohibited actions with test data'],
 probe:[['Проверить, какие данные действительно нужны для расследования','Check which data the investigation actually needs'],['Достаточно времени, типа действия и обезличенного идентификатора. Пароли и содержимое личных данных не нужны; расследование продолжается по журналу.','Time, action type and a pseudonymous identifier are sufficient. Passwords and personal contents are unnecessary; investigation continues through logs.']],
 facts:{
 interface:['Новое правило считает смену мобильной сессии нарушением и закрывает продолжение формы. Журнал показывает отказ обычному пользователю; нужна проверка границы сессии.','The new rule treats a mobile session change as a violation and blocks form continuation. Logs show a legitimate user denied; check the session boundary.'],
 payment:['Повторные запросы проходят проверку входа, но правило не связывает их с завершённой операцией. Запрет всех повторов также сломает восстановление после обрыва сети.','Retries pass entry checks, but the rule does not link them to a completed operation. Blocking every retry would also break recovery after connection loss.'],
 performance:['Правило повторно проверяет доступ для каждой строки отчёта. На тестовом наборе видно лишнее ожидание; убирать защиту целиком не требуется.','The rule rechecks access for every report row. Test data reveals extra waiting; removing protection entirely is unnecessary.']},
 observations:{
 inspect:['Сохранены обезличенные примеры обычного действия и отказа. Пока это основания для проверки правила, а не доказательство атаки.','Pseudonymous examples of normal activity and denial are saved. They justify a rule check rather than proving an attack.'],
 fast:['Точечное ограничение подготовлено на копии. Указаны затронутые действия и срок пересмотра; проверь цену ограничения для обычного пользователя.','A targeted restriction is prepared on a copy. Affected actions and review timing are recorded; check its cost for a legitimate user.'],
 care:['Правило подготовлено по необходимым правам и состоянию операции. Теперь проверь разрешённый путь и отказ там, где доступа быть не должно.','The rule is prepared around required permissions and operation state. Check permitted activity and denial where access must not exist.'],
 limited:['На тестовых данных ограничение остановило затронутый путь. Часть обычных действий остаётся ограничена; владелец знает это до применения.','On test data the restriction stopped the affected route. Some legitimate activity remains limited; the owner knows this before application.'],
 shared:['Обычный путь проходит, запрещённое действие отклонено на тестовых данных. Команда получила результат и план применения; это не обещание полной защищённости и не выпуск правила.','Normal activity passes and prohibited activity is denied on test data. The team received results and an application plan; this promises neither complete security nor a deployed rule.']}}
];
