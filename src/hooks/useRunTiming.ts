import {registerRunTimingFlush} from '../world/runTiming';
import {useEffect} from 'react';
import {useWorld} from '../world/store';
/** Track visible foreground sessions; flush on blur/hide and before changing hero. */
export function useRunTiming(){
 const id=useWorld(s=>s.activeCharacterId),phase=useWorld(s=>s.phase);
 useEffect(()=>{
  if(!id||['start','create','ended'].includes(phase))return;
  let last=performance.now(),running=document.visibilityState==='visible'&&document.hasFocus();
  const flush=()=>{const now=performance.now();if(running)useWorld.getState().recordRunTime(id,now-last);last=now;};
  const change=()=>{flush();running=document.visibilityState==='visible'&&document.hasFocus();};
  const unregister=registerRunTimingFlush(flush);
  const timer=window.setInterval(flush,15000);
  document.addEventListener('visibilitychange',change);window.addEventListener('focus',change);window.addEventListener('blur',change);window.addEventListener('pagehide',flush);
  return()=>{flush();unregister();clearInterval(timer);document.removeEventListener('visibilitychange',change);window.removeEventListener('focus',change);window.removeEventListener('blur',change);window.removeEventListener('pagehide',flush);};
 },[id,phase]);
}
