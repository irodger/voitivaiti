import {text} from './localization';
[
 ['filter','Фильтр писем','Filter messages'],['all','Все','All'],['unread','Непрочитанные','Unread'],['sent','Отправленные','Sent'],
 ['search','Тема, отправитель или команда','Subject, sender or team'],['clear','Очистить поиск','Clear search'],
 ['noResults','Здесь писем не нашлось','No messages found'],['noResultsHint','Попробуй другую тему или покажи все письма.','Try another subject or show all messages.'],['reset','Показать все письма','Show all messages'],
 ['joke','Входящие не равны срочным. Даже если в теме три восклицательных знака.','Incoming does not mean urgent. Even with three exclamation marks.']
].forEach(([id,ru,en])=>text('mailStyle.'+id,ru,en));
