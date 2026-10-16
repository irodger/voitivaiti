import { Download,PlusSquare,Share,Smartphone } from 'lucide-react';
import { text } from '../content/localization';
import './installGame.css';
import { useInstallGame } from './useInstallGame';
text('install.title','Добавить игру на телефон','Add the game to your phone');
text('install.body','Открывай «Войти Вайти» прямо с главного экрана, как отдельное приложение.','Open Voity Vaity straight from your home screen, as a separate app.');
text('install.action','Установить','Install');
text('install.how','Как установить','How to install');
text('install.later','Не сейчас','Not now');
text('install.iosTitle','Как установить на iPhone или iPad','Install on iPhone or iPad');
text('install.share','В Safari нажми «Поделиться».','In Safari, tap Share.');
text('install.home','Выбери «На экран “Домой”». Если пункта нет, открой игру в Safari.','Choose Add to Home Screen. If it is missing, open the game in Safari.');
text('install.add','Нажми «Добавить».','Tap Add.');
text('install.manualTitle','Установка через меню браузера','Install from your browser menu');
text('install.manual','Открой меню браузера → «Установить приложение» или «Добавить на главный экран», если такой пункт доступен.','Open your browser menu → Install app or Add to Home screen, if available.');
text('install.hide','Закрыть инструкцию','Close instructions');
export function InstallGame({automatic=false,eligible=false}:{automatic?:boolean;eligible?:boolean}){
 const model=useInstallGame(automatic,eligible);
 if(!model)return null;
 const {t,instructions,busy,mode,close,act}=model;

 return <section className={automatic?'install-game install-suggestion':'install-game'} aria-label={t('install.title')}><div className="install-game-heading"><Smartphone size={22}/><div><h3>{t('install.title')}</h3>{automatic&&<p>{t('install.body')}</p>}</div></div>{instructions?<><h4>{t(mode==='ios'?'install.iosTitle':'install.manualTitle')}</h4>{mode==='ios'?<ol><li><Share size={17}/>{t('install.share')}</li><li><PlusSquare size={17}/>{t('install.home')}</li><li>{t('install.add')}</li></ol>:<p>{t('install.manual')}</p>}<button className="world-secondary" onClick={close}>{t('install.hide')}</button></>:<div className="install-game-actions"><button className="world-secondary" disabled={busy} onClick={()=>void act()}><Download size={16}/>{t(mode==='native'?'install.action':'install.how')}</button>{automatic&&<button className="world-secondary" onClick={close}>{t('install.later')}</button>}</div>}</section>;
}
