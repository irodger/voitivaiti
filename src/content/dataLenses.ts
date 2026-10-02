import type {RoleLens} from './roleLenses';

export const dataLenses:RoleLens[]=[
 {id:'data-analyst',app:'console',contribution:'discovery',
 inspect:['Сверить график с исходными событиями и периодом','Compare the chart with source events and the time period'],
 trace:['Разделить данные по условиям и проверить объяснение','Split the data by conditions and check the explanation'],
 ask:['Передать общий график как объяснение причины','Send the aggregate chart as an explanation of the cause'],
 missing:['График показывает изменение, но не объясняет его. Коллега спросил, какие люди и события попали в расчёт. Сверь исходные данные и сравнимые группы.','The chart shows a change but does not explain it. A colleague asks which people and events entered the calculation. Check source data and comparable groups.'],
 fast:['Передать ограниченный вывод по проверенной группе','Share a limited finding for the verified group'],
 care:['Проверить вывод на сравнимых группах и независимом источнике','Check the finding across comparable groups and an independent source'],
 check:['Пересчитать результат и проверить границы вывода','Recalculate the result and check the finding’s limits'],
 probe:[['Сверить события с журналом завершённых операций','Compare events with the completed-operation log'],['Число нажатий и число завершённых операций различаются. Для вывода о результате нужны завершённые операции; попытки остаются отдельной величиной.','Click counts differ from completed-operation counts. Outcome analysis needs completed operations; attempts remain a separate measure.']],
 facts:{
 interface:['Общая доля завершений почти не изменилась, но на узком экране после релиза она упала. Рост desktop скрывал проблему мобильной группы.','Overall completion barely changed, but narrow-screen completion fell after release. Desktop growth concealed the mobile-group problem.'],
 payment:['График считает события отправки как покупки. Повторные попытки завысили результат; подтверждённых заказов меньше.','The chart counts submission events as purchases. Repeated attempts inflated the result; there are fewer confirmed orders.'],
 performance:['Среднее время выглядит нормальным, но самые долгие ответы выросли на больших списках. Общая средняя скрывает ожидание этой группы.','Average time looks normal, but the slowest responses grew for large lists. The overall average hides this group’s wait.']},
 observations:{
 inspect:['Проверены период и определение события. Сохрани исходный расчёт и сравни группы, прежде чем объяснять причину.','The period and event definition are checked. Save the original calculation and compare groups before explaining the cause.'],
 fast:['Вывод ограничен группой с проверенными данными. Команда знает, какие пользователи и периоды ещё не покрыты.','The finding is limited to the group with verified data. The team knows which users and periods remain uncovered.'],
 care:['Группы сравниваются за одинаковые периоды; результат сопоставлен с журналом операций. Теперь пересчитай и проверь исключения.','Groups use matching periods; the result is compared with the operation log. Recalculate and check exceptions.'],
 limited:['Расчёт воспроизводится для этой группы. На остальных данных вывод не проверен; причина не объявляется доказанной для всех.','The calculation reproduces for this group. Other data remains unchecked; the cause is not claimed to be proven for everyone.'],
 shared:['Повторный расчёт и независимый источник подтвердили расхождение. Команда получила размер проблемы и границы вывода; сам продукт ещё не исправлен.','Recalculation and an independent source confirmed the discrepancy. The team received its extent and the finding’s limits; the product itself remains unchanged.']}},
 {id:'data-engineer',app:'console',contribution:'preparation',
 inspect:['Проследить записи от источника до итоговой таблицы','Trace records from the source to the output table'],
 trace:['Сверить ключи, время событий и правила преобразования','Compare keys, event times and transformation rules'],
 ask:['Повторить загрузку без проверки уже обработанных записей','Rerun ingestion without checking processed records'],
 missing:['В тестовой таблице появились дубли. Повтор загрузки не узнаёт обработанные записи. Сохрани пример и проследи ключ события; рабочие данные пока не менялись.','Duplicates appeared in the test table. Repeated ingestion does not recognize processed records. Save an example and trace the event key; production data is unchanged.'],
 fast:['Подготовить отдельную проверенную выгрузку за нужный период','Prepare a separate verified extract for the required period'],
 care:['Подготовить исправление преобразования и повторной загрузки','Prepare a transformation and reprocessing fix'],
 check:['На копии проверить количество, дубли и поздние события','Check counts, duplicates and late events on a copy'],
 probe:[['На копии повторить загрузку уже обработанного периода','Reprocess an already ingested period on a copy'],['После повтора число строк выросло, хотя новых событий нет. Проверка повторной обработки выявила дубли, не затронув рабочую таблицу.','Reprocessing increased row counts despite no new events. The repeated-ingestion check exposed duplicates without touching production.']],
 facts:{
 interface:['События с телефона приходят позже. Загрузка берёт только время поступления за текущий день и теряет часть завершений предыдущего дня.','Phone events arrive late. Ingestion uses only today’s arrival time and loses some previous-day completions.'],
 payment:['Один заказ имеет несколько событий попытки, но преобразование создаёт запись покупки из каждого. Нужен ключ подтверждённой операции.','One order has several attempt events, but transformation creates a purchase record from each. It needs the confirmed operation key.'],
 performance:['После релиза загрузка перечитывает всю историю. На копии видно, что граница обработанного периода не сохраняется; размер данных увеличивает задержку.','After release ingestion rereads all history. The copy shows the processed-period boundary is not stored; data growth increases delay.']},
 observations:{
 inspect:['На копии сопоставлены исходные записи и итоговая таблица. Видно, на каком преобразовании расходятся количество и смысл событий.','Source records and the output table are compared on a copy. The transformation where counts and event meaning diverge is visible.'],
 fast:['За нужный период подготовлена отдельная выгрузка. Основная загрузка не изменена; проверь полноту и отметь ограничение периода.','A separate extract is prepared for the required period. Main ingestion is unchanged; verify completeness and mark the period limit.'],
 care:['Исправление подготовлено на копии с планом повторной обработки и возврата. До применения проверь повторы и опоздавшие события.','The fix is prepared on a copy with reprocessing and rollback plans. Check retries and late events before application.'],
 limited:['Выгрузка сверена с источником за выбранный период. Будущие загрузки всё ещё требуют исправления; аналитик знает границы этих данных.','The extract matches the source for the selected period. Future ingestion still needs a fix; the analyst knows these data limits.'],
 shared:['Повтор не создаёт дублей, поздние события учтены, количество совпало с источником на копии. План готов к согласованному применению; рабочая загрузка ещё не переключена.','Reprocessing creates no duplicates, late events are included, and counts match the source on the copy. The plan is ready for agreed application; production ingestion has not switched yet.']}}
];
