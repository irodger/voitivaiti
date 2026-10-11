import {useEffect,useState} from 'react';
import {Download,Share,PlusSquare,Smartphone} from 'lucide-react';
import {installApp,usePwa} from '../pwa';
import {canSuggestInstall,dismissInstall,installMode,installPlatform,readInstallMemory,rememberInstalled} from '../installUx';
import {text,useI18n} from '../content/localization';
import './installGame.css';
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
 const pwa=usePwa(),{t}=useI18n(),[hidden,setHidden]=useState(false),[instructions,setInstructions]=useState(false),[busy,setBusy]=useState(false),[dialog,setDialog]=useState(false);
 const mode=installMode(pwa.installed,!!pwa.install,navigator,!automatic);
 useEffect(()=>{if(pwa.installed)rememberInstalled();},[pwa.installed]);
 useEffect(()=>{if(!automatic)return;const check=()=>setDialog(!!document.querySelector('dialog[open],[role="dialog"][aria-modal="true"]'));check();const observer=new MutationObserver(check);observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});return()=>observer.disconnect();},[automatic]);
 if(mode==='none'||hidden||automatic&&(!eligible||dialog||!installPlatform(navigator).mobile||!canSuggestInstall(readInstallMemory())))return null;
 const close=()=>{if(automatic){dismissInstall();setHidden(true);}else setInstructions(false);};
 const act=async()=>{if(mode==='ios'||mode==='manual'){setInstructions(true);return;}setBusy(true);const outcome=await installApp();setBusy(false);if(outcome==='accepted'){rememberInstalled();setHidden(true);}else if(automatic){dismissInstall();setHidden(true);}};
 return <section className={automatic?'install-game install-suggestion':'install-game'} aria-label={t('install.title')}><div className="install-game-heading"><Smartphone size={22}/><div><h3>{t('install.title')}</h3>{automatic&&<p>{t('install.body')}</p>}</div></div>{instructions?<><h4>{t(mode==='ios'?'install.iosTitle':'install.manualTitle')}</h4>{mode==='ios'?<ol><li><Share size={17}/>{t('install.share')}</li><li><PlusSquare size={17}/>{t('install.home')}</li><li>{t('install.add')}</li></ol>:<p>{t('install.manual')}</p>}<button className="world-secondary" onClick={close}>{t('install.hide')}</button></>:<div className="install-game-actions"><button className="world-secondary" disabled={busy} onClick={()=>void act()}><Download size={16}/>{t(mode==='native'?'install.action':'install.how')}</button>{automatic&&<button className="world-secondary" onClick={close}>{t('install.later')}</button>}</div>}</section>;
}
