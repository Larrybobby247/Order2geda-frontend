// App-shell cache only. API calls (payments, orders, wallet) are never cached.
const C = 'o2g-shell-v1';
self.addEventListener('install', (e) => e.waitUntil(caches.open(C).then((c) => c.addAll(['/', '/offline.html', '/icon.svg'])).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== C).map((x) => caches.delete(x))))));
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.pathname.startsWith('/api') || u.origin !== location.origin) return;
  if (e.request.mode === 'navigate') return e.respondWith(fetch(e.request).catch(() => caches.match('/offline.html')));
  e.respondWith(caches.match(e.request).then((m) => m || fetch(e.request).then((r) => { if (r.ok && /\/assets\//.test(u.pathname)) caches.open(C).then((c) => c.put(e.request, r.clone())); return r; })));
});
