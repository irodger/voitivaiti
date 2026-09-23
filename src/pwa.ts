import { useSyncExternalStore } from 'react';
type InstallPrompt=Event&{prompt:()=>Promise<{outcome:string}>};
type State={install:InstallPrompt|null;update:ServiceWorker|null;ready:boolean;installed:boolean;error:boolean};
let state:State={install:null,update:null,ready:false,installed:false,error:false};
const listeners=new Set<()=>void>();const change=(next:Partial<State>)=>{state={...state,...next};listeners.forEach(fn=>fn());};
export const usePwa=()=>useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn);},()=>state);
export async function installApp(){const prompt=state.install;if(!prompt)return;change({install:null});try{await prompt.prompt();}catch{/* The browser may withdraw the installation prompt. */}}
export function applyUpdate(){if(!state.update)return;const worker=state.update;navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true});worker.postMessage({type:'ACTIVATE_UPDATE'});}
export function startPwa(){
 const standalone=matchMedia('(display-mode: standalone)');const isInstalled=()=>standalone.matches||(navigator as Navigator&{standalone?:boolean}).standalone===true;
 change({installed:isInstalled()});standalone.addEventListener('change',()=>change({installed:isInstalled()}));
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();change({install:event as InstallPrompt});});
 window.addEventListener('appinstalled',()=>change({installed:true,install:null}));
 if(!import.meta.env.PROD||!('serviceWorker' in navigator)||!window.isSecureContext)return;
 void navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js',{scope:import.meta.env.BASE_URL,updateViaCache:'none'}).then(registration=>{
 const inspect=()=>{change({update:navigator.serviceWorker.controller?registration.waiting:null});};inspect();
 registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){inspect();if(!navigator.serviceWorker.controller)change({ready:true});}if(worker.state==='activated'&&state.update===worker)change({update:null});});});
 void navigator.serviceWorker.ready.then(()=>change({ready:true}));
 window.addEventListener('online',()=>{void registration.update().catch(()=>{});});
 }).catch(()=>change({error:true}));
}
