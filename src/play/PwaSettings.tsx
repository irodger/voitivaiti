import { applyUpdate,installApp,usePwa } from '../pwa';
import { text,useI18n } from '../content/localization';
text('pwa.title','Приложение на телефоне','App on your phone');
text('pwa.install','Добавить приложение','Install app');
text('pwa.installed','Открыто как приложение','Running as an app');
text('pwa.ios','На iPhone или iPad: открой игру в Safari → «Поделиться» → «На экран Домой». Оставь «Открывать как веб-приложение» включённым, если этот пункт есть.','On iPhone or iPad: open the game in Safari → Share → Add to Home Screen. Keep Open as Web App enabled if shown.');
text('pwa.other','В меню браузера выбери «Установить приложение» или «Добавить на главный экран», если такой пункт доступен.','In your browser menu, choose Install app or Add to Home screen if available.');
text('pwa.offline','Игра готова к запуску без интернета на этом устройстве.','The game is ready to launch offline on this device.');
text('pwa.preparing','Для первого офлайн-запуска открой опубликованную игру с интернетом и дождись загрузки.','For your first offline launch, open the published game online and let it finish loading.');
text('pwa.error','Не удалось подготовить офлайн-режим. Онлайн-игра доступна; попробуй открыть её позже.','Could not prepare offline mode. You can play online; try opening it again later.');
text('pwa.update','Обновить приложение','Update app');
text('pwa.updateHint','Новая версия готова. Прогресс сохранён; обновление перезапустит игру.','A new version is ready. Your progress is saved; updating restarts the game.');
text('pwa.local','Имя и прогресс хранятся локально. Установка не включает облачную синхронизацию между устройствами.','Your name and progress are stored locally. Installation does not enable cloud sync between devices.');
export function PwaSettings(){const pwa=usePwa(),{t}=useI18n(),ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);return <section className="pwa-settings"><h3>{t('pwa.title')}</h3>{pwa.installed?<p>{t('pwa.installed')}</p>:pwa.install?<button className="world-secondary" onClick={()=>void installApp()}>{t('pwa.install')}</button>:<p>{t(ios?'pwa.ios':'pwa.other')}</p>}<p role="status">{t(pwa.ready?'pwa.offline':pwa.error?'pwa.error':'pwa.preparing')}</p>{pwa.update&&<><p>{t('pwa.updateHint')}</p><button className="world-secondary" onClick={applyUpdate}>{t('pwa.update')}</button></>}<small>{t('pwa.local')}</small></section>}
