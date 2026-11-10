const CACHE='timau-v2';
const FILES=['./','./index.html','./app.css','./app.js','./data.js','./live.json','./manifest.webmanifest','./img/logo.webp','./img/rankhof-stand.webp','./img/rankhof-river.webp','./img/rankhof-aerial.webp','./img/icon-192.png','./img/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
// Netzwerk zuerst (neue Daten), sonst Cache (offline)
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{const c=r.clone();if(r.ok&&new URL(e.request.url).origin===location.origin)caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
