export type InstallMemory={dismissedAt:number;dismissCount:number;installed:boolean};
const key='voiti-vaiti-install-ux';
export function readInstallMemory():InstallMemory{try{const v=JSON.parse(localStorage.getItem(key)??'{}');return {dismissedAt:typeof v.dismissedAt==='number'?v.dismissedAt:0,dismissCount:typeof v.dismissCount==='number'?v.dismissCount:0,installed:v.installed===true};}catch{return {dismissedAt:0,dismissCount:0,installed:false};}}
export function saveInstallMemory(value:InstallMemory){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Optional UX memory must not block play. */}}
export function dismissInstall(now=Date.now()){const v=readInstallMemory();saveInstallMemory({...v,dismissedAt:now,dismissCount:v.dismissCount+1});}
export function rememberInstalled(){saveInstallMemory({...readInstallMemory(),installed:true});}
export function canSuggestInstall(memory:InstallMemory,now=Date.now()){return !memory.installed&&memory.dismissCount<3&&(memory.dismissCount===0||now-memory.dismissedAt>=14*24*60*60*1000);}
export function installPlatform(nav:Pick<Navigator,'userAgent'|'platform'|'maxTouchPoints'>){const ios=/iPad|iPhone|iPod/.test(nav.userAgent)||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1);return {ios,mobile:ios||/Android|Mobile/.test(nav.userAgent)};}
export function installMode(installed:boolean,native:boolean,nav:Pick<Navigator,'userAgent'|'platform'|'maxTouchPoints'>){if(installed||readInstallMemory().installed)return 'none';if(native)return 'native';return installPlatform(nav).ios?'ios':'none';}
