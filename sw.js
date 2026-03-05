const CACHE_NAME = "asset-management-v2";

const urlsToCache = [
  "./",
  "./index.html",
  "./assets/logo.png",
  "./assets/logo-institute.png",
  "https://cdn.jsdelivr.net/npm/exceljs/dist/exceljs.min.js"
];

// تثبيت الـ Service Worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// تفعيل النسخة الجديدة
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// جلب الملفات
self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request).then(response => {

      // إذا كان الملف موجود في الكاش
      if (response) {
        return response;
      }

      // إذا لم يكن موجود نحضره من الإنترنت
      return fetch(event.request).then(networkResponse => {

        // حفظ نسخة في الكاش
        return caches.open(CACHE_NAME).then(cache => {

          cache.put(event.request, networkResponse.clone());

          return networkResponse;

        });

      });

    })

  );

});
