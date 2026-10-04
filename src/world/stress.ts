import {gameConfig} from '../config/game';
import {clamp} from '../utils/numbers';
import type {Character} from './types';
/** Invalid tuning cannot poison a save with NaN. */
export function stressGain(delta:number,multiplier=gameConfig.stress.gainMultiplier){
 const factor=Number.isFinite(multiplier)?Math.max(0,multiplier):1;
 return delta>0?delta*factor:delta;
}
export function stressAfter(current:number,delta:number,multiplier=gameConfig.stress.gainMultiplier){
 return clamp(current+stressGain(delta,multiplier));
}
export function changeStress(character:Character,delta:number){
 character.stats.stress=stressAfter(character.stats.stress,delta);
}
/** Apply mixed load/recovery before clamping, preserving the old routine-day calculation. */
export function stressAfterRecovery(current:number,load:number,recovery:number){
 return clamp(current+stressGain(load)-recovery);
}
