const CACHE_NAME = "my-site-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/about.html",
  "/login.html",
  "/contact.html",
  "/qr.html",
  "/jpg-to-png.html",
  "/eng-to-hindi.html",
  "/unicode.html",
  "/vocal.html",
  "/manifest.json",
  "/icon/icon-192.png",
  "/icon/icon-512.png",
  "/icons/aarambhdaksh.png",
  "/icons/codeyogi-logo.svg"
];

// install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});