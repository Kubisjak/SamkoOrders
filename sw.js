/**
 * Service worker: makes the app work with no network at all, which matters
 * because an iPad on the sofa is not always on wifi.
 *
 * Strategy is cache-first with a background refresh. Bump CACHE_NAME whenever
 * the file list changes so old caches get cleaned out on the next visit.
 */
var CACHE_NAME = 'samko-orders-v8';

var ASSETS = [
  '.',
  'index.html',
  'css/styles.css',
  'js/menu.js',
  'js/store.js',
  'js/i18n.js',
  'js/sound.js',
  'js/app.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (names) {
        return Promise.all(names.map(function (name) {
          return name === CACHE_NAME ? null : caches.delete(name);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var network = fetch(event.request).then(function (response) {
        // Only same-origin, successful responses are worth keeping.
        if (response && response.ok && response.type === 'basic') {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, copy);
          });
        }
        return response;
      }).catch(function () {
        return cached;
      });

      return cached || network;
    })
  );
});
