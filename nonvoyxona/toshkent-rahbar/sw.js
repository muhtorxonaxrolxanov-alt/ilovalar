/* Nonvoyxona veb-ilovasi: internet yo'qda ham ochilishi uchun. tr va 1794836398 ni build_web.py qo'yadi. */
const C = 'nv-tr-1794836398';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('nv-tr-') && k !== C).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return; // server (script.google.com) so'rovlariga tegmaymiz
  if (r.mode === 'navigate') {
    // Avval internetdan (yangi versiya darhol keladi), bo'lmasa saqlangan nusxa
    e.respondWith(fetch(r).then(res => {
      if (res && res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put('./index.html', cp)); }
      return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r)));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data && e.notification.data.url;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    if (url) return self.clients.openWindow(url);
    if (cs[0]) return cs[0].focus();
    return self.clients.openWindow('./');
  }));
});
