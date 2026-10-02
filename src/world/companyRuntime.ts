import type {Campaign,CompanyRuntime} from './types';
const shared=['calendarDay','queue','obligations','professionalDecisions','worldEvents','nextEventDay'] as const;
// Compatibility view for v3 callers. The company runtime owns these fields.
export function attachCompanyRuntime(c:Campaign){
 if(!c.company||!c.life)return;
 c.companyRuntime??=Object.fromEntries(shared.map(key=>[key,c.life![key]])) as CompanyRuntime;
 c.companyRuntime.professionalDecisions??=[];c.companyRuntime.worldEvents??=[];
 for(const key of shared)Object.defineProperty(c.life,key,{enumerable:true,configurable:true,get:()=>c.companyRuntime![key],set:value=>{(c.companyRuntime as unknown as Record<string,unknown>)[key]=value;}});
}

export function personalLifeSnapshot(c:Campaign){const copy=structuredClone(c.life!) as unknown as Record<string,unknown>;for(const key of shared)delete copy[key];return copy as unknown as NonNullable<Campaign["characters"][number]["personalLife"]>;}
