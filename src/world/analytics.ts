type Payload=Record<string,string|number|boolean|undefined>;
export type AnalyticsEvent={id:string;name:string;at:string;playerId:string;sessionId:string;payload:Payload};
const allowed=new Set(['itemId','amount','topicId','upgradeId','professionId','characterId','taskId','templateId','stepId','choiceId','correct','day','minutes','careerNodeId','termId','answerId','projectId','problemId','oldCharacterId','eventId']);
const sessionId=crypto.randomUUID();
let playerId:string=crypto.randomUUID();
try{playerId=localStorage.getItem('voiti-vaiti-anonymous-id')??playerId;localStorage.setItem('voiti-vaiti-anonymous-id',playerId);}catch{/* Analytics must never block play. */}
let sink:(event:AnalyticsEvent)=>void=event=>{try{const all=JSON.parse(localStorage.getItem('voiti-vaiti-events')??'[]') as AnalyticsEvent[];localStorage.setItem('voiti-vaiti-events',JSON.stringify([...all,event].slice(-1500)));}catch{/* Local telemetry is optional. */}};
export function setAnalyticsSink(next:typeof sink){sink=next;}
export function trackGameEvent(name:string,payload:Payload={}){const clean=Object.fromEntries(Object.entries(payload).filter(([key,value])=>allowed.has(key)&&value!==undefined));try{sink({id:crypto.randomUUID(),name,at:new Date().toISOString(),playerId,sessionId,payload:clean});}catch{/* A broken adapter cannot break the game. */}}
export function readAnalytics():AnalyticsEvent[]{try{return JSON.parse(localStorage.getItem('voiti-vaiti-events')??'[]');}catch{return [];}}

