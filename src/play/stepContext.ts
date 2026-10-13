/** Preserve new facts, omit only text already shown in the main brief. */
export function uniqueStepContext(keys:string[],bodyKey:string,t:(key:string)=>string){
 const normalize=(key:string)=>t(key).replace(/\s+/g,' ').trim();
 const seen=new Set([normalize(bodyKey)]);
 return keys.filter(key=>{const value=normalize(key);if(!value||seen.has(value))return false;seen.add(value);return true;});
}
