import {text} from './localization';
import type {Step,TechnicalAction} from '../world/types';

// Objective safety requirements use observations and recovery actions, not trade-off scoring.
export function supportActions(steps:Step[]){
 const action=(id:string,ru:string,en:string,observation:string,english:string,minutes:number,next?:string[],completes=false):TechnicalAction=>({id,labelKey:text(`support.action.${id}`,ru,en),observationKey:text(`support.observation.${id}`,observation,english),minutes,next,completes});
 const first=steps[0],resolve=steps[1];
 first.bodyKey=text('support.context','Клиент не может сохранить заказ. Собери шаги, время ошибки и requestId через канал поддержки.','The customer cannot save an order. Collect the steps, timestamp and requestId through support.');
 Object.assign(first,{resolution:'mechanical',items:undefined,solution:undefined,actionFlow:{initial:['logs','ask-context','password'],legacyActions:{'item-2':'password'},actions:[
 action('logs','Посмотреть журнал обращения','Inspect request logs','Есть requestId и время ошибки. В журнале виден сбой, но неясно, какие действия к нему привели.','The requestId and timestamp reveal the failure, but not the steps leading to it.',10,['ask-context','password']),
 action('ask-context','Уточнить шаги и сообщение об ошибке','Ask for steps and the error message','Клиент описал шаги. Обращение сопоставлено с requestId: после POST заказ не сохраняется. Этих данных достаточно для расследования без пароля.','The customer described the steps. The requestId links the failure: after POST the order is not saved. This is enough to investigate without a password.',15,undefined,true),
 action('password','Попросить пароль для проверки','Request a password to investigate','Коллега остановил запрос: пароль даёт доступ к чужому аккаунту и не нужен для диагностики. Не отправляй и не сохраняй его. Теперь уточни шаги, время и requestId через обычный канал поддержки.','A colleague stopped the request: passwords grant access to someone else’s account and are unnecessary for diagnosis. Do not send or store one. Collect the steps, timestamp and requestId through support instead.',8,['ask-context'])
 ]}});
 Object.assign(resolve,{resolution:'mechanical',options:undefined,actionFlow:{initial:['handoff','password-check'],legacyActions:{bad:'password-check',durable:'handoff'},actions:[
 action('handoff','Передать диагностику владельцу и дать безопасный обход','Send diagnostics to the owner and provide a safe workaround','Владелец воспроизвёл сбой по журналу и шагам. Клиенту отправлен безопасный обход; пароль не запрашивался. Теперь можно отправить результат на review.','The owner reproduced the failure from logs and steps. The customer received a safe workaround without sharing a password. The result is ready for review.',35,undefined,true),
 action('password-check','Запросить пароль и войти как клиент','Request a password and sign in as the customer','Коллега: «Чужой аккаунт — не тестовая среда. У нас уже есть requestId и шаги. Передай эти данные владельцу; доступ клиента не нужен». Работа пока не готова к review.','A colleague says: “A customer account is not a test environment. We have the requestId and steps. Send those to the owner; customer access is unnecessary.” The work is not ready for review.',8,['handoff'])
 ]}});
 return steps;
}
