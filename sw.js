self.addEventListener('install', (event) => {
  console.log('SW: Install Event');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Activate Event');
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // ネットワークにそのまま通す（空にせず、これを書くのが超重要！）
  event.respondWith(fetch(event.request));
});
