import {saveBeforeUpdate} from './world/store';
import { useSyncExternalStore } from 'react';
type InstallPrompt=Event&{prompt:()=>Promise<{outcome:string}>};
type State={install:InstallPrompt|null;update:ServiceWorker|null;ready:boolean;installed:boolean;error:boolean;availableVersion?:string;applying?:boolean;saveFailed?:boolean};
let state:State={install:null,update:null,ready:false,installed:false,error:false};
const listeners=new Set<()=>void>();const change=(next:Partial<State>)=>{state={...state,...next};listeners.forEach(fn=>fn());};
export const usePwa=()=>useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn);},()=>state);
export async function installApp(){const prompt=state.install;if(!prompt)return;change({install:null});try{await prompt.prompt();}catch{/* The browser may withdraw the installation prompt. */}}
let registrationRef:ServiceWorkerRegistration|undefined;
function inspectUpdate(registration:ServiceWorkerRegistration){const worker=navigator.serviceWorker.controller?registration.waiting:null;if(worker===state.update)return;change({update:worker,availableVersion:undefined});if(!worker)return;const channel=new MessageChannel();const timer=setTimeout(()=>channel.port1.close(),3000);channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();if(state.update===worker&&typeof event.data?.version==='string')change({availableVersion:event.data.version});};worker.postMessage({type:'GET_VERSION'},[channel.port2]);}
export async function checkForUpdate(){if(!registrationRef)return;try{await registrationRef.update();}catch{/* Offline: an already downloaded update can still be applied. */}inspectUpdate(registrationRef);}
export function applyUpdate(){if(!state.update||state.applying)return;if(!saveBeforeUpdate()){change({saveFailed:true});return;}const worker=state.update;change({applying:true,saveFailed:false});let reloaded=false;const reload=()=>{if(reloaded)return;reloaded=true;location.reload();};navigator.serviceWorker.addEventListener('controllerchange',reload,{once:true});try{worker.postMessage({type:'ACTIVATE_UPDATE'});}catch{navigator.serviceWorker.removeEventListener('controllerchange',reload);change({applying:false,error:true});}}
export function startPwa(){
 const standalone=matchMedia('(display-mode: standalone)');const isInstalled=()=>standalone.matches||(navigator as Navigator&{standalone?:boolean}).standalone===true;
 change({installed:isInstalled()});standalone.addEventListener('change',()=>change({installed:isInstalled()}));
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();change({install:event as InstallPrompt});});
 window.addEventListener('appinstalled',()=>change({installed:true,install:null}));
 if(!import.meta.env.PROD||!('serviceWorker' in navigator)||!window.isSecureContext)return;
 void navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js',{scope:import.meta.env.BASE_URL,updateViaCache:'none'}).then(registration=>{
 registrationRef=registration;const inspect=()=>inspectUpdate(registration);inspect();
 registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){inspect();if(!navigator.serviceWorker.controller)change({ready:true});}if(worker.state==='activated'&&state.update===worker)change({update:null});});});
 void navigator.serviceWorker.ready.then(()=>change({ready:true}));
 window.addEventListener('online',()=>{void registration.update().catch(()=>{});});
 }).catch(()=>change({error:true}));
}
