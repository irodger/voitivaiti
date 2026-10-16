import { text } from './localization';
const copy = [
  ['title', 'Как устроена компания', 'How the company works'],
  ['product', 'Продукт', 'Product'],
  ['ownership', 'Отвечает за', 'Owns'],
  ['depends', 'Зависит от', 'Depends on'],
  ['independent', 'Основная работа команды', 'Core team work'],
  ['contact', 'Контакт появится при совместной работе', 'A contact appears when you work together'],
  ['type.studio', 'Небольшое продуктовое бюро', 'Small product studio'],
  ['type.growing', 'Растущая продуктовая компания', 'Growing product company'],
  ['type.established', 'Зрелая продуктовая компания', 'Established product company'],
  [
    'product.purpose',
    'Команды вместе развивают сервис для пользователей; проект ниже — его рабочая реализация.',
    'Teams develop one user-facing service; the project below is its working implementation.',
  ],
  ['department.product', 'Продукт и разработка', 'Product and engineering'],
  ['department.foundation', 'Общие технологии', 'Shared technology'],
  ['department.growth', 'Развитие бизнеса', 'Business growth'],
  ['department.operations', 'Работа с клиентами', 'Customer operations'],
  ['team.product', 'Product', 'Product'],
  ['team.payments', 'Payments', 'Payments'],
  ['team.security', 'Security', 'Security'],
  ['team.platform', 'Platform', 'Platform'],
  ['team.sales', 'Sales', 'Sales'],
  ['team.marketing', 'Marketing', 'Marketing'],
  ['team.support', 'Support', 'Support'],
  [
    'purpose.product',
    'Пользовательские пути и выпуск функций',
    'User journeys and feature delivery',
  ],
  ['purpose.payments', 'Надёжное прохождение оплаты', 'Reliable payment processing'],
  ['purpose.security', 'Доступы и защита данных', 'Access and data protection'],
  ['purpose.platform', 'Нагрузка и общая инфраструктура', 'Capacity and shared infrastructure'],
  ['purpose.sales', 'Обещания клиентам и продажи', 'Customer commitments and sales'],
  ['purpose.marketing', 'Привлечение пользователей и кампании', 'User acquisition and campaigns'],
  [
    'purpose.support',
    'Обращения пользователей и воспроизведение проблем',
    'User reports and reproduction',
  ],
  ['owns.web', 'Экраны и пользовательские действия', 'Screens and user interactions'],
  ['owns.api', 'Поведение сервиса', 'Service behavior'],
  ['owns.payment', 'Оплата', 'Payments'],
  ['owns.access', 'Доступы', 'Access'],
  ['owns.infrastructure', 'Нагрузка и инфраструктура', 'Capacity and infrastructure'],
  ['owns.sales', 'Обещания клиентам', 'Customer commitments'],
  ['owns.campaigns', 'Кампании', 'Campaigns'],
  ['owns.support', 'Обращения пользователей', 'User reports'],
  [
    'campaign.planned',
    'Marketing готовит кампанию. После запуска Platform проверит, выдержит ли продукт ожидаемый поток.',
    'Marketing is preparing a campaign. After launch, Platform will check whether the product can handle the expected traffic.',
  ],
  [
    'campaign.launched',
    'Marketing запустил кампанию: ожидается рост обращений к продукту. Platform отвечает за запас нагрузки; Product должен проверить пользовательский путь. Сбоя пока не подтверждено.',
    'Marketing launched a campaign: product traffic is expected to grow. Platform owns capacity; Product must check the user journey. No failure has been confirmed yet.',
  ],
  [
    'campaign.title',
    'Кампания Marketing: выдержит ли продукт новый поток?',
    'Marketing campaign: can the product handle the new traffic?',
  ],
  [
    'campaign.forecast',
    'План кампании и границы прогноза',
    'Campaign plan and forecast boundaries',
  ],
  [
    'campaign.prompt',
    'Сравни ожидаемый поток с проверенной границей. Прогноз — повод проверить, а не доказательство аварии.',
    'Compare expected traffic with the verified boundary. A forecast calls for a check; it is not proof of an incident.',
  ],
  ['campaign.plannedTraffic', 'Ожидаемый поток', 'Expected traffic'],
  [
    'campaign.plannedTraffic.data',
    'Marketing ожидает примерно втрое больше обращений во время кампании. Это прогноз, реальные данные ещё нужно проверить.',
    'Marketing expects roughly three times the usual traffic during the campaign. This is a forecast; actual data still needs checking.',
  ],
  ['campaign.capacity', 'Последняя проверенная граница', 'Last verified capacity'],
  [
    'campaign.capacity.data',
    'Platform проверяла обычный поток. Успешная работа вчера не подтверждает поведение при новом объёме.',
    'Platform verified normal traffic. Yesterday’s success does not validate the new volume.',
  ],
  [
    'campaign.observation',
    'Прогноз кампании выше проверенной границы. Есть риск нагрузки, но нет доказанного текущего сбоя.',
    'The campaign forecast exceeds the verified boundary. There is a capacity risk, but no proven current failure.',
  ],
  [
    'campaign.trace',
    'Запросить у владельца проверку пути и нагрузки',
    'Ask the owner to check the user journey and capacity',
  ],
  [
    'campaign.trace.result',
    'По зависимости Product от владельца инфраструктуры отправлен запрос: проверить путь пользователя и нагрузку сервиса вместе. Рост обращений сам по себе ещё не означает, что причина в интерфейсе.',
    'A request follows Product’s infrastructure dependency: check the user journey and service capacity together. More traffic alone does not establish an interface cause.',
  ],
  [
    'campaign.local',
    'Передать уточнение пути и времени, пока владелец проверяет',
    'Send journey and timing clarification while the owner checks',
  ],
  [
    'campaign.local.result',
    'Путь и время переданы владельцу. Это локальные данные; запас нагрузки владельца ещё не подтверждён.',
    'Journey and timing were sent to the owner. This is local evidence; the owner’s capacity is not yet confirmed.',
  ],
  [
    'campaign.reply',
    'Открыть результат проверки владельца нагрузки',
    'Open the capacity owner’s test result',
  ],
  [
    'campaign.reply.result',
    'Владелец инфраструктуры проверил удвоенный поток: он проходит. Для ожидаемого тройного потока запас не подтверждён. Теперь нужно выбрать границу выпуска и проверить её.',
    'The infrastructure owner tested twice the usual traffic: it passes. Capacity for the expected triple traffic is unverified. Choose and verify the release boundary next.',
  ],
  [
    'campaign.tested',
    'Нагрузочная проверка: обычный и удвоенный потоки проходят на этой версии. Условия сохранены владельцем инфраструктуры.',
    'Load test: normal and double traffic pass on this version. The infrastructure owner saved the conditions.',
  ],
  [
    'campaign.gap',
    'Ожидается тройной поток; проверки этого объёма в отчёте нет. Это открытая граница, а не доказанный сбой.',
    'Triple traffic is expected; this volume is missing from the report. It is an open boundary, not a proven failure.',
  ],
  [
    'campaign.bounded',
    'Передан проверенный ограниченный путь для обычного и удвоенного потока. Ожидаемый тройной поток остался за границами результата.',
    'The checked bounded path for normal and double traffic was handed over. Expected triple traffic remains outside the result.',
  ],
  [
    'campaign.proper',
    'После изменения пользовательский путь проверен при обычном и ожидаемом тройном потоке. Владелец инфраструктуры получил результат; Product может проверить пользовательский путь следующей версии.',
    'After the change, the user journey was checked at normal and expected triple traffic. The infrastructure owner received the result; Product can review the next version’s user journey.',
  ],
  [
    'campaign.evidence',
    'Переданы условия и проверка ожидаемого потока. Рабочая система этой ролью не изменялась; реализация остаётся у владельца инфраструктуры.',
    'Expected-traffic evidence and conditions were handed over. This role did not change production; implementation remains with the infrastructure owner.',
  ],
  [
    'campaign.returned',
    'Кампания продолжилась: ожидаемый тройной поток по-прежнему не покрыт ограниченным результатом. Product вернулась к владельцу инфраструктуры с незакрытой границей нагрузки.',
    'The campaign continued: expected triple traffic is still outside the bounded result. Product returned to the infrastructure owner with the open capacity boundary.',
  ],
  [
    'campaign.review',
    'Product получила проверенный результат владельца нагрузки. Следующая работа — review пути пользователя на новой версии, а не повтор прежнего прогноза.',
    'Product received the capacity owner’s checked result. Next, review the user journey on the new version rather than repeating the forecast.',
  ],
  [
    'campaign.evidenceNext',
    'Владелец инфраструктуры получил проверенные условия от коллеги. Нужно перенести их в рабочую реализацию и проверить ожидаемый поток.',
    'The infrastructure owner received checked conditions from a colleague. Apply them to production and verify expected traffic.',
  ],
  [
    'campaign.handoff',
    'Передать Platform проверенный результат и границы; сообщить Marketing',
    'Send the checked result and boundaries to Platform; inform Marketing',
  ],
];
copy.forEach(([id, ru, en]) => text('org.' + id, ru, en));

text('npc.org.marketing.name', 'Марина', 'Marina');

const campaignChoice = [
  ['scope', 'Какую границу кампании берёшь?', 'Which campaign boundary will you cover?'],
  [
    'scope.body',
    'Platform подтвердила 2× обычного потока; Marketing ожидает 3×. Короткий локальный фикс покрывает обычный и удвоенный поток, оставляя 3× открытым. Более объёмное решение включает ожидаемый тройной поток. Оба варианта нужно проверить и передать с их границами; выбор зависит от времени и объёма работы.',
    'Platform confirmed twice the usual traffic; Marketing expects triple traffic. A short local fix covers normal and double traffic, leaving triple traffic open. The broader solution includes expected triple traffic. Both need verification and a handoff with their boundaries; choose according to time and scope.',
  ],
  [
    'limited.label',
    'Локальный фикс пути для обычного и 2× потока; 3× остаётся открытым',
    'Local journey fix for normal and double traffic; triple traffic stays open',
  ],
  [
    'shared.label',
    'Расширить решение пути до ожидаемого 3× потока',
    'Extend the journey solution to expected triple traffic',
  ],
  [
    'limited.labelEvidence',
    'Подготовить ограниченный результат для обычного и 2× потока; 3× остаётся открытым',
    'Prepare bounded evidence for normal and double traffic; triple traffic stays open',
  ],
  [
    'shared.labelEvidence',
    'Подготовить результат с проверкой ожидаемого 3× потока',
    'Prepare evidence including expected triple traffic',
  ],
  [
    'limited.observation',
    'Выбран ограниченный объём: путь при обычном и удвоенном потоке. До передачи проверь эти условия. Ожидаемый тройной поток остаётся вне результата.',
    'The selected scope is bounded: the journey at normal and double traffic. Verify these conditions before handoff. Expected triple traffic remains outside the result.',
  ],
  [
    'shared.observation',
    'В объём включён путь при обычном и ожидаемом тройном потоке. Сам выбор ещё не подтверждает результат — проверь оба условия перед передачей.',
    'The scope includes the journey at normal and expected triple traffic. Selecting it does not confirm the result — verify both conditions before handoff.',
  ],
  [
    'verify-limited.label',
    'Проверить пользовательский путь при обычном и 2× потоке',
    'Verify the user journey at normal and double traffic',
  ],
  [
    'verify-shared.label',
    'Проверить пользовательский путь при обычном и ожидаемом 3× потоке',
    'Verify the user journey at normal and expected triple traffic',
  ],
  [
    'verify-limited.observation',
    'Пользовательский путь проходит при обычном и удвоенном потоке в проверенной версии. Тройной поток не проверен этим результатом; передай эту границу вместе с ним.',
    'The user journey passes at normal and double traffic on the checked version. Triple traffic is not verified by this result; hand over that boundary with it.',
  ],
  [
    'verify-shared.observation',
    'Пользовательский путь проходит при обычном и ожидаемом тройном потоке в проверенной версии. Передай условия и результат; следующая версия потребует отдельного review пути Product.',
    'The user journey passes at normal and expected triple traffic on the checked version. Hand over conditions and results; the next version needs a separate Product journey review.',
  ],
];
campaignChoice.forEach(([id, ru, en]) => text('org.campaign.' + id, ru, en));

text(
  'org.campaign.scope.bodyEvidence',
  'Platform подтвердила 2× обычного потока; Marketing ожидает 3×. Можно подготовить короткую проверку обычного и удвоенного потока, оставив 3× открытым, или включить ожидаемый тройной поток в более объёмную проверку. Оба результата передаются с условиями; реализация остаётся у владельца инфраструктуры.',
  'Platform confirmed double traffic; Marketing expects triple traffic. Prepare a short check of normal and double traffic, leaving triple traffic open, or include expected triple traffic in a broader check. Hand over either result with its conditions; implementation remains with the infrastructure owner.',
);
text(
  'org.campaign.verify-shared.observationEvidence',
  'В проверке прошли пользовательский путь при обычном и ожидаемом тройном потоке. Условия и результат готовы к передаче; твоя роль не меняла рабочую систему, реализация остаётся у владельца инфраструктуры.',
  'The checked user journey passes at normal and expected triple traffic. Conditions and results are ready for handoff; your role did not change production, and implementation remains with the infrastructure owner.',
);

const productReview = [
  [
    '',
    'Product: проверить путь на следующей версии',
    'Product: review the journey on the next version',
  ],
  [
    '.body',
    'На прошлой версии обычный и тройной потоки прошли проверку. Product получила следующую версию: прежний результат остаётся в истории, но не подтверждает новую сборку. Сравни условия её отчёта перед решением о границе review.',
    'Normal and triple traffic passed on the previous version. Product received the next version: the previous result remains valid history but does not validate this build. Compare its report conditions before deciding the review boundary.',
  ],
  [
    '.inspect',
    'Открыть отчёт Product по новой версии и прошлый результат',
    'Open Product’s next-version report and the previous result',
  ],
  [
    '.seen',
    'В новой версии Product проверила обычный поток; результата ожидаемого тройного потока в отчёте нет. Это пробел проверки, а не доказанный сбой.',
    'Product checked normal traffic on the next version; its report has no result for expected triple traffic. This is a test gap, not a proven failure.',
  ],
  ['.normal', 'Новая версия · обычный поток', 'Next version · normal traffic'],
  [
    '.normal.data',
    'Product прошла пользовательский путь при обычном потоке на новой версии. Условия и успешный результат записаны.',
    'Product completed the user journey at normal traffic on the next version. Conditions and a passing result are recorded.',
  ],
  ['.triple', 'Новая версия · ожидаемый поток 3×', 'Next version · expected triple traffic'],
  [
    '.triple.data',
    'В отчёте новой версии отсутствует проверка тройного потока. Прошлая версия его выдерживала; переносить её результат на новую без проверки нельзя.',
    'The next-version report lacks a triple-traffic check. The previous version handled it; its result cannot validate a new version without checking.',
  ],
  [
    '.request',
    'Запросить у Platform проверку пути при 3× на новой версии',
    'Ask Platform to check the journey at triple traffic on the next version',
  ],
  [
    '.readReply',
    'Сравнить обычный и тройной потоки в ответе Platform',
    'Compare normal and triple traffic in Platform’s reply',
  ],
  [
    '.reply',
    'Platform повторила путь на новой версии: обычный поток проходит, при тройном воспроизводится сбой. Замечание относится к новой версии, а не отменяет проверку прошлой.',
    'Platform repeated the journey on the next version: normal traffic passes; triple traffic reproduces a failure. The finding concerns this new version and does not invalidate the previous check.',
  ],
  [
    '.reply.normal',
    'Platform: на присланной новой версии путь при обычном потоке проходит.',
    'Platform: the journey passes at normal traffic on the supplied next version.',
  ],
  [
    '.reply.triple',
    'Platform: на той же новой версии путь при ожидаемом тройном потоке воспроизводит сбой. Сохранены версия, объём и шаги.',
    'Platform: on that same next version the journey fails at expected triple traffic. Version, volume and steps are saved.',
  ],
];
productReview.forEach(([id, ru, en]) => text('org.campaign.productReview' + id, ru, en));

text(
  'org.campaign.productReview.bounded.label',
  'Передать принятие обычного потока с открытой проверкой 3×',
  'Hand over acceptance of normal traffic with the triple-traffic check open',
);
text(
  'org.campaign.productReview.bounded',
  'Product приняла только обычный поток новой версии. Тройной поток этой версии не подтверждён; граница передана Platform.',
  'Product accepted only normal traffic on the next version. Triple traffic on this version remains unverified; the boundary was handed to Platform.',
);
text(
  'org.campaign.productReview.bounded.next',
  'Проверка тройного потока новой версии остаётся открытой. Принятие обычного потока не закрывает эту границу.',
  'The triple-traffic check on the next version remains open. Acceptance of normal traffic does not cover this boundary.',
);
text(
  'org.campaign.productReview.finding.label',
  'Передать Platform условия сбоя новой версии при 3×',
  'Send Platform the next-version failure conditions at triple traffic',
);
text(
  'org.campaign.productReview.finding',
  'Platform получила воспроизводимое замечание: обычный поток новой версии проходит, ожидаемый тройной — нет. Review обнаружило проблему; рабочая система этим действием не исправлена.',
  'Platform received a reproducible finding: normal traffic on the next version passes; expected triple traffic does not. Review found the issue; this action did not repair production.',
);
text(
  'org.campaign.productReview.finding.next',
  'В истории сохранён сбой новой версии при тройном потоке. Исправление принадлежит Platform и остаётся отдельной работой.',
  'History records a triple-traffic failure on the next version. The repair belongs to Platform and remains separate work.',
);
