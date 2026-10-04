import {useEffect,useState} from 'react';
const matches=(query:string)=>typeof window!=='undefined'&&typeof window.matchMedia==='function'&&window.matchMedia(query).matches;
/** SSR-safe and subscribed to resize changes. */
export function useMediaQuery(query:string){
 const [value,setValue]=useState(()=>matches(query));
 useEffect(()=>{
  if(typeof window==='undefined'||typeof window.matchMedia!=='function')return;
  const media=window.matchMedia(query),update=()=>setValue(media.matches);
  update();media.addEventListener('change',update);
  return()=>media.removeEventListener('change',update);
 },[query]);
 return value;
}
