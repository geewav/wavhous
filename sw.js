// Service Worker: sw.js

// Cache name
const CACHE_NAME = 'wavhous-cache-v1';

// Files to cache
const urlsToCache = [
  '/',
  '/styles.css',
  '/png/wavhous_desktop.png',
  '/png/wavhous_mobile.png',
  '/svg/wavhous_logo_blackwhiteborder.svg',
  '/png/geewav.png',
  '/svg/music_player.svg',
  '/svg/add_to_home.svg',
  '/favicons/android-icon-192x192.png',
  '/favicons/apple-icon-180x180.png',
  '/favicons/favicon-32x32.png',
  '/favicons/favicon-16x16.png'
];

// Install event: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found, else fetch from network
        return response || fetch(event.request);
      })
  );
});