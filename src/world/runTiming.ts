export type RunTiming={startedAt?:number;observedAt:number;activeMs:number};
/** Time offered by the foreground tracker, never a gap spent with the game closed. */
export function addRunTime(previous:RunTiming|undefined,elapsedMs:number,now:number):RunTiming{
 const elapsed=Number.isFinite(elapsedMs)?Math.max(0,Math.min(30000,elapsedMs)):0;
 return {...previous,observedAt:previous?.observedAt??now,activeMs:(previous?.activeMs??0)+elapsed};
}
export function newRunTiming(now=Date.now()):RunTiming{return {startedAt:now,observedAt:now,activeMs:0};}
/** Flush the current foreground session before a terminal action freezes its report. */
let foregroundFlush:(()=>void)|undefined;
export function registerRunTimingFlush(flush:()=>void){foregroundFlush=flush;return()=>{if(foregroundFlush===flush)foregroundFlush=undefined;};}
export function flushRunTiming(){foregroundFlush?.();}
