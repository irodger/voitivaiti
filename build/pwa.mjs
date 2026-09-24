import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
export function workerSource(version, files, appVersion) {
 const prefix='voiti-vaiti-'+encodeURIComponent(files[0])+'-';
 return `const CACHE=${JSON.stringify(prefix+version)};
const FILES=${JSON.stringify(files)};
const PREFIX=${JSON.stringify(prefix)};
self.addEventListener('install',event=>event.waitUntil((async()=>{try{const cache=await caches.open(CACHE);await cache.addAll(FILES.map(url=>new Request(url,{cache:'reload'})));const old=self.registration.active;if(old){const version=await new Promise(resolve=>{const channel=new MessageChannel();const timer=setTimeout(()=>{channel.port1.close();resolve(null);},1500);channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();resolve(event.data?.version);};old.postMessage({type:'GET_VERSION'},[channel.port2]);});if(!version)await self.skipWaiting();}}catch(error){await caches.delete(CACHE);throw error;}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await Promise.all((await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE).slice(0,-1).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();if(event.data?.type==='GET_VERSION')event.ports?.[0]?.postMessage({version:${JSON.stringify(appVersion??'unknown')}});});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
if(event.request.mode==='navigate'){event.respondWith((async()=>{try{const response=await fetch(new Request(event.request,{cache:'no-store'}));if(response.ok)return response;}catch{}const cached=await (await caches.open(CACHE)).match(FILES[0]);return cached||Response.error();})());return;}
const path=url.pathname;
if(!FILES.includes(path))return;
event.respondWith((async()=>{const cached=await (await caches.open(CACHE)).match(path);return cached||fetch(event.request);})());});`;
}
export function pwaPlugin(){let config;return {name:'voiti-vaiti-offline',apply:'build',configResolved(c){config=c;},generateBundle(_,bundle){const base=config.base;const files=[base,...Object.keys(bundle).filter(n=>n!=='index.html').map(n=>base+n)];const hash=createHash('sha256');hash.update(base);hash.update(workerSource.toString());hash.update(readFileSync(join(config.root,'index.html')));for(const item of Object.values(bundle))hash.update(item.type==='chunk'?item.code:item.source);
const walk=dir=>{for(const file of readdirSync(dir,{withFileTypes:true})){const path=join(dir,file.name);if(file.isDirectory())walk(path);else{files.push(base+relative(config.publicDir,path).replaceAll('\\','/'));hash.update(readFileSync(path));}}};walk(config.publicDir);
this.emitFile({type:'asset',fileName:'sw.js',source:workerSource(hash.digest('hex').slice(0,16),files,readFileSync(join(config.root,'src/content/releases.ts'),'utf8').match(/GAME_VERSION='([^']+)'/)[1])});
}};}

// A previously installed PWA must also be able to leave its cached production
// worker when this origin is serving Vite development pages.
export function developmentPwaRecovery(){
 let root,base;
 return {name:'voiti-vaiti-dev-pwa-recovery',apply:'serve',configResolved(config){root=config.root;base=config.base;},
 configureServer(server){server.middlewares.use((req,res,next)=>{
  if(req.url?.split('?')[0]!==base+'sw.js')return next();
  const version=readFileSync(join(root,'src/content/releases.ts'),'utf8').match(/GAME_VERSION='([^']+)'/)[1];
  res.setHeader('Content-Type','application/javascript');
  res.setHeader('Cache-Control','no-store');
  res.end(`self.addEventListener('message',event=>{if(event.data?.type==='GET_VERSION')event.ports?.[0]?.postMessage({version:${JSON.stringify(version)}});if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{await self.clients.claim();await self.registration.unregister();})()));
self.addEventListener('fetch',event=>{if(event.request.method==='GET')event.respondWith(fetch(new Request(event.request,{cache:'no-store'})));});`);
 });}};
}
