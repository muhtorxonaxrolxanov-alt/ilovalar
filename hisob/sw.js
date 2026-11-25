/* tez.py: avval saqlangan nusxa, yangisi orqada. Versiya — fayllar mazmuni xeshi. */
const P='hk-',C=P+'79d827532a0f',FILES=["./3d.html", "./gate.html", "./gate.js", "./hisob.html", "./icon-192.png", "./icon-512.png", "./", "./manifest.webmanifest", "./murojaat.html", "./santex.html", "./shogird.html", "./sxema.html"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(f=>fetch(new Request(f,{cache:'reload'})).then(r=>{if(!r.ok)throw 0;return c.put(new Request(new URL(f,self.registration.scope).href),r)})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(P)&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin||!u.href.startsWith(self.registration.scope))return;
 if(/\/(sw\.js|o\.html|ilova\.mobileconfig)$/.test(u.pathname))return;
 const key=u.origin+u.pathname.replace(/\/index\.html$/,'/');
 e.respondWith(caches.open(C).then(c=>c.match(key)).then(m=>m||fetch(r).catch(x=>{if(r.mode==='navigate')return caches.match(self.registration.scope).then(z=>{if(z)return z;throw x});throw x})))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=e.notification.data&&e.notification.data.url;e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{if(url)return self.clients.openWindow(url);if(cs[0])return cs[0].focus();return self.clients.openWindow('./')}))});
