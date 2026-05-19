self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // キャッシュは使わず、普通にインターネットから取得するだけ
  event.respondWith(fetch(event.request));
});
