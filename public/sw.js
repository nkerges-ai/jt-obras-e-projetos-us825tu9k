// Service Worker Minimal Setup for PWA and Offline Cache
const CACHE_NAME = 'jt-obras-cache-v2'
const urlsToCache = ['/', '/admin', '/campo', '/cliente/login', '/cliente/dashboard', '/index.html']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response
      }
      return fetch(event.request).catch(() => {
        // If offline and request fails, return root index.html to allow SPA routing
        if (event.request.mode === 'navigate') {
          return caches.match('/')
        }
      })
    }),
  )
})
