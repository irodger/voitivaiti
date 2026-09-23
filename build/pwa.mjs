import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
export function workerSource(version, files) {
 const prefix='voiti-vaiti-'+encodeURIComponent(files[0])+'-';
 return `const CACHE=${JSON.stringify(prefix+version)};
const FILES=${JSON.stringify(files)};
const PREFIX=${JSON.stringify(prefix)};
self.addEventListener('install',event=>event.waitUntil((async()=>{try{const cache=await caches.open(CACHE);await cache.addAll(FILES);}catch(error){await caches.delete(CACHE);throw error;}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await Promise.all((await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
const path=event.request.mode==='navigate'?FILES[0]:url.pathname;
if(!FILES.includes(path))return;
event.respondWith((async()=>{const cached=await (await caches.open(CACHE)).match(path);return cached||fetch(event.request);})());});`;
}
export function pwaPlugin(){let config;return {name:'voiti-vaiti-offline',apply:'build',configResolved(c){config=c;},generateBundle(_,bundle){const base=config.base;const files=[base,...Object.keys(bundle).filter(n=>n!=='index.html').map(n=>base+n)];const hash=createHash('sha256');hash.update(base);hash.update(readFileSync(join(config.root,'index.html')));for(const item of Object.values(bundle))hash.update(item.type==='chunk'?item.code:item.source);
const walk=dir=>{for(const file of readdirSync(dir,{withFileTypes:true})){const path=join(dir,file.name);if(file.isDirectory())walk(path);else{files.push(base+relative(config.publicDir,path).replaceAll('\\','/'));hash.update(readFileSync(path));}}};walk(config.publicDir);
this.emitFile({type:'asset',fileName:'sw.js',source:workerSource(hash.digest('hex').slice(0,16),files)});
}};}
