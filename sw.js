const CACHE_NAME = 'nawmok-falak-v1';
const urlsToCache = [
  '.',
  'index.html',
  'manifest.json',
  'https://twemoji.maxcdn.com/v/latest/192x192/1f680.png',
  'https://twemoji.maxcdn.com/v/latest/512x512/1f680.png',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        if (event.request.method === 'GET') {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return fetchResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});
