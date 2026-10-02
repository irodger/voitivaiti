import type {RoleLens} from './roleLenses';

export const deliveryLenses:RoleLens[]=[
 {id:'project',app:'chat',contribution:'preparation',
 inspect:['Собрать фактическое состояние работ и блокеры у исполнителей','Gather actual work status and blockers from owners'],
 trace:['Сопоставить зависимости, доступное время и обещанный срок','Compare dependencies, available time and the promised date'],
 ask:['Запросить обновлённые оценки без изменения состава работ','Request updated estimates without changing the work scope'],
 missing:['Оценки обновились, но два человека всё ещё ждут одну незавершённую работу. Сумма часов не показывает зависимость. Сохрани оценки и выясни, что должно закончиться первым.','Estimates changed, but two people still wait for the same unfinished item. Adding hours does not reveal dependencies. Save the estimates and find what must finish first.'],
 fast:['Согласовать ограниченный объём и явно перенести остальное','Agree on a limited scope and explicitly postpone the rest'],
 care:['Пересобрать последовательность работ и подтвердить новый срок','Rebuild the work sequence and confirm a new date'],
 check:['Проверить план с исполнителями и теми, кто ждёт результат','Check the plan with owners and those awaiting the result'],
 probe:[['Уточнить, какую работу вытеснит срочная задача','Clarify which work the urgent task would displace'],['Свободного исполнителя нет. Срочная работа вытеснит обещанную задачу; её заказчик должен узнать о переносе до нового обещания.','No owner is free. Urgent work displaces a promised task; its requester needs to know about the delay before a new promise.']],
 facts:{
 interface:['Исправление формы ждёт решения о мобильном поведении. Разработка и QA оценили свои часы отдельно, но проверка начнётся только после этого решения.','The form fix awaits a mobile-behavior decision. Development and QA estimated separately, but verification starts only after that decision.'],
 payment:['Исправление оплаты требует изменения сервиса и повторной проверки заказа. Исполнители уже заняты обещанной функцией; обе работы не помещаются в прежний срок.','The payment fix needs a service change and order verification. Owners are already working on a promised feature; both cannot fit the original date.'],
 performance:['Команда запланировала проверку скорости до готовности большого набора данных. Часы выделены, но нужный результат зависит от другой работы.','The team scheduled speed checks before the large dataset was ready. Time is allocated, but the result depends on another item.']},
 observations:{
 inspect:['Исполнители подтвердили готовые части и ожидания. Отчёт о проценте готовности заменён списком зависимостей; проверь последовательность.','Owners confirmed completed parts and waiting items. A completion percentage is replaced by dependencies; check their order.'],
 fast:['Ограниченный объём согласован, перенесённая работа получила владельца и следующий контакт. Теперь проверь, не потерян ли обязательный результат.','Limited scope is agreed; postponed work has an owner and next contact. Check that the required outcome has not been lost.'],
 care:['Зависимости стоят в выполнимом порядке, новый срок предложен участникам. Подтверждение нужно получить до передачи плана.','Dependencies are ordered feasibly and a new date is proposed. Obtain confirmation before handing off the plan.'],
 limited:['Исполнители подтвердили ограниченный объём. Заказчик знает, что отложено; оставшаяся работа не исчезла и ещё ждёт выполнения.','Owners confirmed the limited scope. The requester knows what was delayed; remaining work still awaits completion.'],
 shared:['Исполнители подтвердили последовательность и доступное время, заказчик — новый срок. План готов к исполнению; исправление продукта ещё предстоит.','Owners confirmed the sequence and available time; the requester confirmed the new date. The plan is ready to execute; the product still needs a fix.']}},
 {id:'delivery',app:'chat',contribution:'preparation',
 inspect:['Сверить готовность изменений, проверок и пути возврата','Compare readiness of changes, checks and rollback'],
 trace:['Проследить зависимости выпуска и условия остановки','Trace release dependencies and stop conditions'],
 ask:['Проверить только успешную сборку как основание для выпуска','Check only the successful build as the basis for release'],
 missing:['Сборка зелёная, но проверка повтора операции и путь возврата ещё не готовы. Успешная сборка — один факт, а не разрешение выпуска. Собери оставшиеся условия готовности.','The build passes, but retry verification and rollback are not ready. A passing build is one fact rather than release permission. Gather the remaining readiness conditions.'],
 fast:['Подготовить ограниченный выпуск с наблюдением и остановкой','Prepare a limited release with monitoring and stop conditions'],
 care:['Согласовать выпуск после проверки всех зависимостей','Agree on release after verifying all dependencies'],
 check:['Пройти условия готовности, остановки и возврата с владельцами','Walk through readiness, stop and rollback conditions with owners'],
 probe:[['Уточнить, кто остановит выпуск при ухудшении','Clarify who stops release if behavior worsens'],['Назначен дежурный, определён наблюдаемый признак ухудшения и путь возврата. Это план действий; проверка готовности ещё нужна.','An on-call owner, observable deterioration signal and rollback route are identified. This is an action plan; readiness still needs verification.']],
 facts:{
 interface:['Мобильный сценарий не проверен на новой версии. Desktop готов, но общий выпуск затронет и телефоны; нужны границы выпуска или дополнительная проверка.','The mobile journey is untested on the new version. Desktop is ready, but a full release affects phones too; define release limits or add verification.'],
 payment:['Сервис и экран готовы по отдельности, но повтор после обрыва сети не проверен совместно. Выпуск одного компонента не завершает проверку операции.','The service and screen are ready separately, but retry after connection loss is untested together. Releasing one component does not complete operation verification.'],
 performance:['Проверка прошла на малом объёме, а рабочий объём больше. У выпуска нет порога остановки по времени ответа; его нужно согласовать до начала.','Checks passed on a small dataset while production is larger. Release lacks a response-time stop threshold; agree on one before starting.']},
 observations:{
 inspect:['Готовые компоненты отделены от непроверенных условий. Видны владельцы пробелов; проследи, что блокирует выпуск.','Ready components are separated from unchecked conditions. Gaps have owners; trace what blocks release.'],
 fast:['Подготовлены границы ограниченного выпуска и наблюдение. До запуска владельцы должны подтвердить остановку и возврат.','Limited release boundaries and monitoring are prepared. Owners must confirm stop and rollback before launch.'],
 care:['Владельцы согласовали зависимости и недостающие проверки. Решение о выпуске остаётся за подтверждением их результатов.','Owners agreed on dependencies and missing checks. Release remains conditional on confirmed results.'],
 limited:['Владельцы подтвердили условия ограниченного выпуска, остановки и возврата. Остальные сценарии остаются вне допуска; версия ещё не выпущена.','Owners confirmed limited release, stop and rollback conditions. Other journeys remain outside approval; the version has not shipped.'],
 shared:['Владельцы подтвердили результаты проверок и готовность возврата. Выпуск согласован с явными условиями; доставка и наблюдение ещё впереди.','Owners confirmed check results and rollback readiness. Release is agreed with explicit conditions; delivery and monitoring are still ahead.']}}
];
