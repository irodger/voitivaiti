import {text} from './localization';
[
 ['waiting','Запрос у коллеги','A colleague has the request'],['ready','Ответ доступен','Reply available'],
 ['received','Ответ пришёл. Его ещё нужно изучить в рабочем действии — сам ответ не завершает проверку.','The reply arrived. Inspect it through the work action; receiving it does not complete verification.'],
 ['latest','Последняя запись','Latest record'],['joke','Сначала факты. Потом магия. Кофе — параллельно.','Facts first. Magic later. Coffee in parallel.']
].forEach(([id,ru,en])=>text('workPolish.'+id,ru,en));
