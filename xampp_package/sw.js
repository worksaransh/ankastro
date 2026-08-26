const CACHE_NAME = 'ankjyotish-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Simple pass-through fetch listener to satisfy PWA criteria
  e.respondWith(fetch(e.request));
});
