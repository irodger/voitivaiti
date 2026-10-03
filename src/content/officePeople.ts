import {text} from './localization';
const entries:Record<string,[string,string]>={
 work:['За рабочим столом','At their desk'],meeting:['На встрече команды','In a team meeting'],review:['Обсуждает результат','Discussing the result'],incident:['Разбирается с ЧП','Handling an incident'],lunch:['На перерыве','On a break'],evening:['Собирается домой','Getting ready to leave'],walking:['Идёт по офису','Walking through the office'],talk:['Нажми, чтобы поговорить','Select to talk'],new:['Есть новая тема для разговора','A new conversation topic is available'],you:['Твоё рабочее место','Your workstation'],
};
Object.entries(entries).forEach(([id,[ru,en]])=>text('officePerson.'+id,ru,en));
