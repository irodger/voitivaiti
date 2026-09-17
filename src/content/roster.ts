import { text } from './localization';
export const rosterNames=[['Лена','Lena'],['Игорь','Igor'],['Даша','Dasha'],['Роман','Roman'],['Маша','Masha'],['Денис','Denis'],['Соня','Sonya'],['Артём','Artyom'],['Ника','Nika'],['Кирилл','Kirill'],['Юля','Yulia'],['Тимур','Timur'],['Оля','Olya'],['Антон','Anton'],['Вера','Vera'],['Даня','Danya'],['Алиса','Alice'],['Лев','Lev'],['Женя','Zhenya'],['Саша','Alex']].map(([ru,en],i)=>text('roster.name.'+i,ru,en));
export const personalities=['calm','direct','curious','careful'];
[['calm','Спокойный','Calm'],['direct','Прямолинейный','Direct'],['curious','Любопытный','Curious'],['careful','Осторожный','Careful']].forEach(([id,ru,en])=>text('roster.'+id,ru,en));
