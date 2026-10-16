import { text } from './localization';
import type { Option } from '../world/types';

type Pair = [string, string];
type Approach = { label: Pair; tradeoff: Pair; response: Pair };
type Decision = { situation: Pair; durable: Approach; focused: Approach };

export const professionalDecisions: Record<string, Decision> = {
  'backend-api': {
    situation: [
      'Один paymentId создал два заказа. Поддержке нужен безопасный путь сегодня, а соседние клиенты используют тот же API. Выбери границу изменения.',
      'One paymentId created two orders. Support needs a safe path today, while other clients share this API. Choose the scope of the change.',
    ],
    durable: {
      label: [
        'Закрепить уникальность операции в хранилище',
        'Enforce operation uniqueness in storage',
      ],
      tradeoff: [
        '55 мин. Проверка общего правила стоит дополнительной энергии; охватывает все клиенты.',
        '55 min. Checking the shared rule costs extra energy; covers every client.',
      ],
      response: [
        'Правило и повторная выдача результата включены в план. Проверка затронет общий путь записи, поэтому понадобится больше времени.',
        'The plan includes uniqueness and returning the stored result. Verifying the shared write path will take more time.',
      ],
    },
    focused: {
      label: [
        'Ограничить повторы на входе и оставить общий контракт на следующий этап',
        'Limit retries at the entry point and defer the shared contract',
      ],
      tradeoff: [
        '35 мин. Меньше текущего стресса; обход ограничен этим входом, поддержке придётся объяснить границу.',
        '35 min. Less immediate stress; protection is limited to this entry point and support must explain the boundary.',
      ],
      response: [
        'Выбран ограниченный путь. Поддержка знает его границы; другие входы ещё требуют отдельной проверки.',
        'A limited path was chosen. Support knows its boundaries; other entry points still need separate checks.',
      ],
    },
  },
  'mobile-offline': {
    situation: [
      'Действие сохранено локально, но ответ потерялся. Можно проверить весь цикл восстановления или временно ограничить отправку одним экраном.',
      'The action is stored locally but the response was lost. Verify the full recovery cycle or temporarily limit submission to one screen.',
    ],
    durable: {
      label: [
        'Связать очередь и подтверждение одним ключом при возврате из фона',
        'Use one key for queue and acknowledgement after backgrounding',
      ],
      tradeoff: [
        '55 мин. Дополнительная энергия на потерю сети и возврат из фона.',
        '55 min. Extra energy to cover connectivity loss and background restoration.',
      ],
      response: [
        'План включает повтор с прежним ключом и сверку подтверждения после возврата. Для этих состояний выделено дополнительное время.',
        'The plan reuses the key and reconciles acknowledgement after restoration. Extra time is reserved for these states.',
      ],
    },
    focused: {
      label: [
        'Оставить явную повторную отправку в одном экране',
        'Keep explicit resubmission within one screen',
      ],
      tradeoff: [
        '35 мин. Меньше текущего стресса; человек должен вернуться к экрану, это ограничение придётся объяснять.',
        '35 min. Less immediate stress; the user must return to the screen and this limitation needs explaining.',
      ],
      response: [
        'Повторная отправка ограничена одним экраном. Автоматическое восстановление из фона остаётся за границами этого решения.',
        'Resubmission stays within one screen. Automatic background restoration remains outside this scope.',
      ],
    },
  },
  'qa-repeat': {
    situation: [
      'Есть повтор оплаты, но до релиза осталось мало времени. Отчёт нужен разработчику сейчас; широкий набор устройств тоже ещё не проверен.',
      'A payment retry case exists but release is close. The developer needs a report now; broader device coverage is still missing.',
    ],
    durable: {
      label: [
        'Добавить медленную сеть и соседнее устройство к воспроизведению',
        'Add slow networking and a neighboring device to the reproduction',
      ],
      tradeoff: [
        '55 мин. Дополнительная энергия на границы сбоя; разработчик получит отчёт позже.',
        '55 min. Extra energy to establish scope; the developer receives the report later.',
      ],
      response: [
        'В план отчёта вошли два окружения и задержка сети. Срок передачи сдвинут: это расширение проверки, не обещание отсутствия других багов.',
        'The report plan now includes two environments and network delay. Handoff is later; this is wider coverage, not a promise of no other bugs.',
      ],
    },
    focused: {
      label: [
        'Передать один точный воспроизводимый случай сейчас',
        'Send one precise reproducible case now',
      ],
      tradeoff: [
        '35 мин. Меньше текущего стресса; рекомендация касается только проверенного окружения, не всего релиза.',
        '35 min. Less immediate stress; the recommendation covers one environment, not the whole release.',
      ],
      response: [
        'Разработчику передан ограниченный случай со шагами и номерами заказов. Широкая рекомендация к релизу пока не дана.',
        'A scoped case with steps and order IDs was handed over. No broad release recommendation has been made.',
      ],
    },
  },
  'qa-regression': {
    situation: [
      'Исправление готово. Можно задержать общий выпуск ради соседних проверок или разрешить только ограниченный пилот.',
      'The fix is ready. Delay general release for adjacent checks or allow only a limited pilot.',
    ],
    durable: {
      label: [
        'Проверить повтор, отказ банка и восстановление перед общим выпуском',
        'Check retry, bank decline and recovery before general release',
      ],
      tradeoff: [
        '55 мин. Дополнительная энергия; общий выпуск ждёт проверки.',
        '55 min. Extra energy; general release waits for verification.',
      ],
      response: [
        'Общий выпуск ждёт расширенной проверки. Отказы и повторные попытки включены в план, результаты ещё нужно получить.',
        'General release waits for broader checks. Declines and retries are in scope; results still need collecting.',
      ],
    },
    focused: {
      label: [
        'Начать с ограниченного пилота и явно перечислить непроверенное',
        'Start a limited pilot and list untested paths explicitly',
      ],
      tradeoff: [
        '35 мин. Меньше текущего стресса; охват ограничен, поддержка должна знать о непроверенных путях.',
        '35 min. Less immediate stress; coverage is limited and support must know the untested paths.',
      ],
      response: [
        'Разрешён только пилот. Непроверенные пути перечислены; это не разрешение общего выпуска.',
        'Only a pilot is approved. Untested paths are listed; this does not approve general release.',
      ],
    },
  },
  'design-checkout': {
    situation: [
      'Покупатель узнаёт итоговую сумму слишком поздно. Поддержка просит срочную правку; общий паттерн оплаты встречается ещё на двух экранах.',
      'The customer learns the total too late. Support needs a quick change; the same payment pattern appears on two other screens.',
    ],
    durable: {
      label: [
        'Согласовать итог и подтверждение во всём паттерне оплаты',
        'Align totals and confirmation across the payment pattern',
      ],
      tradeoff: [
        '55 мин. Дополнительная энергия на соседние состояния; локальная правка выйдет позже.',
        '55 min. Extra energy for adjacent states; the local change arrives later.',
      ],
      response: [
        'В работу включены соседние состояния и общий текст подтверждения. Согласование займёт дополнительное время.',
        'Adjacent states and shared confirmation copy are in scope. Alignment takes extra time.',
      ],
    },
    focused: {
      label: [
        'Показать сумму и явное действие на проблемном экране',
        'Show the total and explicit action on the affected screen',
      ],
      tradeoff: [
        '35 мин. Меньше текущего стресса; остальные экраны остаются вне объёма, это нужно обозначить.',
        '35 min. Less immediate stress; other screens remain outside scope and that boundary must be stated.',
      ],
      response: [
        'Выбрана локальная правка суммы и кнопки. Другие экраны не объявлены проверенными и остаются в очереди.',
        'A local total-and-button change was chosen. Other screens are not declared verified and remain queued.',
      ],
    },
  },
  'product-metrics': {
    situation: [
      'Начавших оплату стало больше, завершений меньше. Новая кампания уже обещана, но добавит людей в проблемный checkout.',
      'More people start payment but fewer finish. A campaign is promised but would send more people into a broken checkout.',
    ],
    durable: {
      label: [
        'Перенести кампанию и согласовать восстановление оплаты',
        'Defer the campaign and align checkout recovery',
      ],
      tradeoff: [
        '55 мин. Дополнительная энергия на пересогласование; маркетинг получит новый срок.',
        '55 min. Extra energy for realignment; marketing needs a revised date.',
      ],
      response: [
        'Кампания отложена, восстановление оплаты получило приоритет. Команде предстоит согласовать срок, а не обещать мгновенный рост.',
        'The campaign is deferred and checkout recovery prioritized. The team must agree a date rather than promise instant growth.',
      ],
    },
    focused: {
      label: [
        'Оставить кампанию только для пути, не затронутого сбоем',
        'Keep the campaign only for a path unaffected by the failure',
      ],
      tradeoff: [
        '35 мин. Меньше текущего стресса; аудитория ограничена, границу нужно объяснить маркетингу.',
        '35 min. Less immediate stress; the audience is limited and marketing needs that boundary explained.',
      ],
      response: [
        'Выбран ограниченный объём кампании. Проблемный checkout не считается восстановленным; его работа остаётся в очереди.',
        'A limited campaign scope was chosen. The affected checkout is not considered recovered and remains queued.',
      ],
    },
  },
  'project-plan': {
    situation: [
      'QA ждёт интеграцию, интеграция — API. Можно пересогласовать общий график или подготовить независимую часть параллельно.',
      'QA waits for integration and integration waits for the API. Realign the schedule or prepare independent work in parallel.',
    ],
    durable: {
      label: [
        'Пересогласовать зависимые даты с каждым владельцем',
        'Realign dependent dates with each owner',
      ],
      tradeoff: [
        '55 мин. Дополнительная энергия на договорённости; новая дата станет видна заказчику.',
        '55 min. Extra energy for coordination; the revised date becomes visible to the stakeholder.',
      ],
      response: [
        'Зависимые даты включены в пересогласование. Скрывать сдвиг не будем; владельцам ещё нужно подтвердить план.',
        'Dependent dates are being realigned. The delay will be visible; owners still need to confirm the plan.',
      ],
    },
    focused: {
      label: [
        'Запустить только независимую подготовку, сохранив блокировки интеграции',
        'Start independent preparation while keeping integration gates',
      ],
      tradeoff: [
        '35 мин. Меньше текущего стресса; промежуточный результат ограничен, полный релиз не обещан.',
        '35 min. Less immediate stress; the interim result is limited and a full release is not promised.',
      ],
      response: [
        'Параллельно идёт только независимая подготовка. API и интеграция остаются явными зависимостями релиза.',
        'Only independent preparation runs in parallel. API and integration remain explicit release dependencies.',
      ],
    },
  },
  'sre-incident': {
    situation: [
      'Ошибки начались после релиза. Старый вариант стабилен, но новая функция уже используется частью клиентов.',
      'Errors began after release. The old version is stable but some customers already use the new feature.',
    ],
    durable: {
      label: [
        'Откатить релиз целиком и проверить восстановление',
        'Roll back the release and verify recovery',
      ],
      tradeoff: [
        '55 мин. Дополнительная энергия на проверку; новая функция временно недоступна всем.',
        '55 min. Extra energy for verification; the feature is temporarily unavailable to everyone.',
      ],
      response: [
        'Выбран полный откат с проверкой восстановления. Клиентам понадобится объяснить временную потерю новой функции.',
        'A full rollback with recovery verification was chosen. Customers need an explanation for losing the feature temporarily.',
      ],
    },
    focused: {
      label: [
        'Изолировать проблемный трафик, сохранив остальной сервис',
        'Isolate affected traffic and keep the rest of the service',
      ],
      tradeoff: [
        '35 мин. Меньше текущего стресса; затронутая группа остаётся ограниченной, нужен контроль границы.',
        '35 min. Less immediate stress; the affected group remains restricted and the boundary needs monitoring.',
      ],
      response: [
        'Принята изоляция проблемного пути. Восстановление всей аудитории не объявлено; за границей ограничения нужно наблюдать.',
        'Isolation of the affected path was chosen. Full audience recovery is not declared; the boundary needs monitoring.',
      ],
    },
  },
};

export function professionalOptions(
  id: string,
): { bodyKey: string; options: Option[] } | undefined {
  const decision = professionalDecisions[id];
  if (!decision) return;
  const key = `professional.${id}`;
  return {
    bodyKey: text(`${key}.situation`, ...decision.situation),
    options: [decision.durable, decision.focused].map((approach, index) => ({
      id: index === 0 ? 'durable' : 'bad', // Existing choice IDs preserve in-progress saves.
      labelKey: text(`${key}.${index}.label`, ...approach.label),
      detailKey: text(`${key}.${index}.tradeoff`, ...approach.tradeoff),
      responseKey: text(`${key}.${index}.response`, ...approach.response),
      decisionStyle: index === 0 ? 'quality' : 'speed',
      minutes: index === 0 ? 20 : 0,
      effects:
        index === 0
          ? [
              { target: 'stress', value: 1 },
              { target: 'energy', value: -1 },
            ]
          : [{ target: 'stress', value: -1 }],
    })),
  };
}
