import {useEffect,type RefObject} from 'react';
/** Use a navigation key, not the entire changing campaign state. */
export function useScrollReset(ref:RefObject<HTMLElement|null>,key:string){
 useEffect(()=>{ref.current?.scrollTo({top:0});},[ref,key]);
}
