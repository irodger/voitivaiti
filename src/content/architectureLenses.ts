import type {RoleLens} from './roleLenses';

export const architectureLenses:RoleLens[]=[
 {id:'solution-architect',app:'ide',contribution:'preparation',
 inspect:['Проследить пользовательское действие через связанные системы','Trace a user action through connected systems'],
 trace:['Сверить границы ответственности и договорённости обмена','Compare responsibility boundaries and exchange agreements'],
 ask:['Проверить переход сразу на новую версию обмена в модели','Model a direct switch to the new exchange version'],
 missing:['В модели новая сторона отвечает, но прежний клиент не понимает состояние результата. Переход требует совместимости двух версий. Сохрани случай и проследи обмен по границам систем.','The new side responds in the model, but the old client cannot understand result state. The transition needs compatibility between versions. Save the case and trace exchanges across system boundaries.'],
 fast:['Подготовить переходный адаптер для затронутого обмена','Prepare a transition adapter for the affected exchange'],
 care:['Подготовить совместимый переход с владельцами систем','Prepare a compatible transition with system owners'],
 check:['В модели проверить старую и новую стороны, повтор и возврат','Model old and new sides, retries and rollback'],
 probe:[['Уточнить, какие участники не могут обновиться одновременно','Identify participants that cannot update simultaneously'],['Мобильный клиент обновляется позже сервиса. Некоторое время обе версии должны работать вместе; владельцы подтвердили порядок перехода.','The mobile client updates after the service. Both versions must coexist for a while; owners confirmed the transition order.']],
 facts:{
 interface:['Сервис передаёт новое состояние формы, прежний клиент не знает его и скрывает действие. Нужна совместимость обмена, а не уменьшение элементов.','The service sends a new form state that the old client does not recognize, so it hides the action. Exchange compatibility is needed rather than smaller elements.'],
 payment:['Одна система подтверждает приём, другая — завершение оплаты. Клиент трактует первое как результат, затем повторяет операцию; границы подтверждения расходятся.','One system confirms receipt and another confirms payment completion. The client treats receipt as the result, then retries; confirmation boundaries differ.'],
 performance:['Один участник ждёт полный ответ нескольких систем, хотя часть данных пригодна раньше. В обмене не определён частичный результат и его ограничения.','One participant waits for full responses from several systems although some data is usable earlier. Exchanges do not define partial results or their limits.']},
 observations:{
 inspect:['Сохранена последовательность сообщений и подтверждений. Видно, где участники по-разному понимают результат; сверим ответственность.','The message and confirmation sequence is saved. Participants disagree about the result at an identifiable point; compare responsibilities.'],
 fast:['Адаптер подготовлен в модели для одной границы. Остальные обмены остаются прежними; проверь, какие ограничения он сохраняет.','An adapter is prepared in the model for one boundary. Other exchanges remain unchanged; check its remaining limitations.'],
 care:['Владельцы согласовали версии обмена и порядок перехода. Модель готова к проверке сосуществования и возврата.','Owners agreed on exchange versions and transition order. The model is ready for coexistence and rollback checks.'],
 limited:['В модели затронутый обмен проходит через адаптер. Соседние системы ещё используют разные правила; их переход остаётся отдельной работой.','The affected exchange passes through the adapter in the model. Neighboring systems still use differing rules; their transition remains separate work.'],
 shared:['В модели прошли обе версии, повтор и возврат. Владельцы получили план реализации; системы в рабочем продукте ещё не переключены.','Both versions, retries and rollback passed in the model. Owners received an implementation plan; production systems have not switched yet.']}},
 {id:'architect',app:'ide',contribution:'preparation',
 inspect:['Проследить состояние и зависимости внутри приложения','Trace state and dependencies inside the application'],
 trace:['Найти владельца состояния и проверить границы компонентов','Identify the state owner and check component boundaries'],
 ask:['Смоделировать перенос общего кода в отдельный компонент','Model moving shared code into a separate component'],
 missing:['Код в модели разделён, но два компонента всё ещё меняют одно состояние независимо. Новая папка не устранила зависимость. Сохрани схему и найди владельца состояния.','The model separates code, but two components still change one state independently. A new folder did not remove the dependency. Save the model and identify the state owner.'],
 fast:['Подготовить локальную границу вокруг проблемного пути','Prepare a local boundary around the problematic path'],
 care:['Подготовить единое владение состоянием и поэтапный переход','Prepare single state ownership and a staged transition'],
 check:['В модели проверить повтор, соседний компонент и возврат','Model retries, a neighboring component and rollback'],
 probe:[['Проследить, кто читает и кто меняет одно состояние','Trace who reads and changes the shared state'],['Два компонента меняют состояние, третий хранит его копию. Схема объясняет расхождение; перенос кода сам по себе не меняет этих правил.','Two components change state while a third stores a copy. The model explains the divergence; moving code alone does not change these rules.']],
 facts:{
 interface:['Размер формы хранится отдельно от состояния экрана. После смены ширины один компонент использует старое значение; владение адаптацией разделено.','Form size is stored separately from screen state. After a width change one component uses the old value; responsive behavior has split ownership.'],
 payment:['Два компонента считают себя владельцами отправки. Общий признак ожидания обновляется позже повторного действия; правило одной операции нигде не закреплено.','Two components both own submission. Shared waiting state updates after a retry; no boundary enforces a single operation.'],
 performance:['Изменение одной строки уведомляет весь список. Компоненты зависят от общего изменяемого состояния; разделение отображения не убирает лишнюю работу.','A single-row change notifies the entire list. Components depend on shared mutable state; separating views does not remove excess work.']},
 observations:{
 inspect:['Сохранены чтения и изменения состояния. Схема показывает зависимость, которую предстоит проверить на повторном действии.','State reads and changes are recorded. The model shows a dependency to check with repeated interaction.'],
 fast:['В модели проблемный путь получил локальную границу. Другие компоненты сохраняют прежнее владение; проверь соседний случай.','The model gives the problematic path a local boundary. Other components retain existing ownership; check a neighboring case.'],
 care:['В модели определён один владелец состояния и порядок перехода компонентов. До реализации проверь сосуществование старого и нового пути.','The model defines one state owner and component transition order. Check coexistence of old and new paths before implementation.'],
 limited:['Повтор проходит в локальной модели. Соседний компонент остаётся зависимым от общего состояния; ограничение передано разработке.','Retries pass in the local model. A neighboring component still depends on shared state; development received the limitation.'],
 shared:['В модели проверены повтор, соседний компонент и возврат. Решение готово к поэтапной реализации; код и рабочий продукт ещё не изменены.','Retries, a neighboring component and rollback were checked in the model. The solution is ready for staged implementation; code and production remain unchanged.']}}
];
