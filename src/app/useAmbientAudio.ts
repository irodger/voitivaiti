import {useWorld} from '../world/store';
import {useEffect} from 'react';
import {usePreferences} from '../content/localization';
import {createAmbientAudio} from './ambientAudio';
export function useAmbientAudio(){
 useEffect(()=>{
  const Audio=window.AudioContext??(window as typeof window & {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
  if(!Audio)return;
  const ambient=createAmbientAudio(()=>new Audio());
  const update=()=>ambient.configure(usePreferences.getState().soundEnabled,!document.hidden,['office','reward'].includes(useWorld.getState().phase)?'office':'calm');
  const gesture=()=>ambient.gesture(),hide=()=>ambient.configure(false,false);
  update();const unsubscribe=usePreferences.subscribe(update),unsubscribeWorld=useWorld.subscribe(update);
  document.addEventListener('visibilitychange',update);document.addEventListener('pointerdown',gesture);document.addEventListener('keydown',gesture);window.addEventListener('pagehide',hide);window.addEventListener('pageshow',update);
  return()=>{unsubscribe();unsubscribeWorld();window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',update);document.removeEventListener('visibilitychange',update);document.removeEventListener('pointerdown',gesture);document.removeEventListener('keydown',gesture);ambient.dispose();};
 },[]);
}
