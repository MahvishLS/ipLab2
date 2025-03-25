const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/icons/icon-192-1.png',
  '/icons/icon-512.png',
  '/assets/brownie.png',
  '/assets/cakes.png',
  '/assets/cookies.png',
  '/assets/donuts.webp',
  '/assets/logo.webp',
  '/assets/muffins.webp',
  '/assets/pastry.webp',
  '/script.js'
];

self.addEventListener('install', (event) => {
  console.log('Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache opened, caching assets');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log(' Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(' Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/** Intercept Fetch Requests */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log(' Serving from cache:', event.request.url);
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          console.log(' Caching new response:', event.request.url);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch((error) => {
      console.error(' Fetch error:', error);
    })
  );
});

/**  Handle Push Notifications */
self.addEventListener('push', (event) => {


  if (!event.data) {
    console.error('Push event has NO data!');
    return;
  }

  const rawText = event.data.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    console.error("🔥 Failed to parse push payload:", e);
    return;
  }

  if (data.method !== 'pushMessage' || !data.message) {
    console.error('Invalid push message format:', data);
    return;
  }

  const options = {
    body: data.message,
    icon: '/icons/icon-512.png',
    badge: '/icons/icon-512.png',
  };

  if (Notification.permission === 'granted') {
 
    event.waitUntil(
      self.registration.showNotification("Mahvish's Bakery", options)
        .then(() => console.log(" Notification displayed!"))
        .catch(err => console.error(" Notification error:", err))
    );
  } else {
    console.log(' Notification permission not granted.');
  }
});

/** Handle Notification Click */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') 
  );
});

self.addEventListener('sync', event=>{
  if(event.tag=='syncMessage'){
    console.log("Sync successful!");
  };
});

