import {saveBeforeUpdate} from './world/store';
import {useSyncExternalStore} from 'react';
type InstallPrompt=Event&{prompt:()=>Promise<{outcome:string}>};
type CheckStatus='idle'|'checking'|'downloading'|'available'|'current'|'failed'|'development';
type State={install:InstallPrompt|null;update:ServiceWorker|null;ready:boolean;installed:boolean;error:boolean;availableVersion?:string;applying?:boolean;saveFailed?:boolean;checkStatus:CheckStatus};
let state:State={install:null,update:null,ready:false,installed:false,error:false,checkStatus:'idle'};
const listeners=new Set<()=>void>();
const change=(next:Partial<State>)=>{state={...state,...next};listeners.forEach(fn=>fn());};
export const usePwa=()=>useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn);},()=>state);
export async function installApp(){const prompt=state.install;if(!prompt)return;change({install:null});try{await prompt.prompt();}catch{/* The browser may withdraw the prompt. */}}
let registrationPromise:Promise<ServiceWorkerRegistration>|undefined;
let checkPromise:Promise<void>|undefined;
const watched=new WeakSet<ServiceWorker>();
function inspectUpdate(r:ServiceWorkerRegistration){
 const worker=r.waiting;if(!worker){if(!state.applying)change({update:null});return;}
 change({checkStatus:'available'});if(worker===state.update)return;
 change({update:worker,availableVersion:undefined});
 const channel=new MessageChannel(),timer=setTimeout(()=>channel.port1.close(),3000);
 channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();if(state.update===worker&&typeof event.data?.version==='string'&&event.data.version!=='unknown')change({availableVersion:event.data.version});};
 try{worker.postMessage({type:'GET_VERSION'},[channel.port2]);}catch{clearTimeout(timer);channel.port1.close();}
}
function watchInstall(r:ServiceWorkerRegistration){
 const worker=r.installing;if(!worker||watched.has(worker))return;
 watched.add(worker);change({checkStatus:'downloading'});
 const inspect=()=>{
  if(worker.state==='installed'){inspectUpdate(r);if(!navigator.serviceWorker.controller)change({ready:true});}
  if(worker.state==='activated'){change({ready:true});if(!state.applying)change({update:null,checkStatus:'current'});}
  if(worker.state==='redundant')change({checkStatus:'failed'});
 };
 worker.addEventListener('statechange',inspect);inspect();
}
function registration(){
 if(!registrationPromise)registrationPromise=navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js',{scope:import.meta.env.BASE_URL,updateViaCache:'none'}).then(r=>{
  r.addEventListener('updatefound',()=>watchInstall(r));watchInstall(r);inspectUpdate(r);return r;
 }).catch(error=>{registrationPromise=undefined;throw error;});return registrationPromise;
}
export function checkForUpdate():Promise<void>{
 if(checkPromise)return checkPromise;
 if(!import.meta.env.PROD||!('serviceWorker' in navigator)||!window.isSecureContext){change({checkStatus:'development'});return Promise.resolve();}
 change({checkStatus:'checking',error:false});
 checkPromise=(async()=>{try{const r=await registration();await r.update();watchInstall(r);inspectUpdate(r);if(!r.waiting&&!r.installing)change({checkStatus:'current'});}
 catch{change({error:true,checkStatus:state.update?'available':'failed'});}finally{checkPromise=undefined;}})();return checkPromise;
}
export function applyUpdate(){
 if(!state.update||state.applying)return;
 if(!saveBeforeUpdate()){change({saveFailed:true});return;}
 const worker=state.update;change({applying:true,saveFailed:false});let reloaded=false;
 const reload=()=>{if(reloaded)return;reloaded=true;location.reload();};
 navigator.serviceWorker.addEventListener('controllerchange',reload,{once:true});
 try{worker.postMessage({type:'ACTIVATE_UPDATE'});}catch{navigator.serviceWorker.removeEventListener('controllerchange',reload);change({applying:false,error:true,checkStatus:'failed'});}
}
export function startPwa(){
 const standalone=matchMedia('(display-mode: standalone)');const isInstalled=()=>standalone.matches||(navigator as Navigator&{standalone?:boolean}).standalone===true;
 change({installed:isInstalled()});standalone.addEventListener('change',()=>change({installed:isInstalled()}));
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();change({install:event as InstallPrompt});});
 window.addEventListener('appinstalled',()=>change({installed:true,install:null}));
 if(!import.meta.env.PROD||!('serviceWorker' in navigator)||!window.isSecureContext)return;
 void registration().catch(()=>change({error:true,checkStatus:'failed'}));void navigator.serviceWorker.ready.then(()=>change({ready:true}));
 window.addEventListener('online',()=>void checkForUpdate());
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')void checkForUpdate();});
}
