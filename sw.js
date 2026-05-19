const CACHE_NAME = 'voton-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png', // ロゴなども入れておくと完璧です
  '/icon.png'
];

// インストール時にファイルを保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('ファイルをキャッシュ中...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ネットがない時はキャッシュから出す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュがあればそれを返す、なければネットに取りに行く
      return response || fetch(event.request);
    })
  );
});
