const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/styles.css",
  "/indexedDb.js",
  "/db.js",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
 
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then(function (cache) {
      cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(RUNTIME).then((cache) => {
        return fetch(event.request).then((response) => {
          if (response.status == 200) {
            cache.put(event.request.url, response.clone());
          }
          return response;
        });
      })
    );
    return
  }

  event.respondWith(
    fetch(event.request).catch( () => {
      return caches.match(event.request).then(res => {
        if(res){
          return res
        } else if (event.request.headers.get("accept").includes("text/html")){
          caches.match("/")
        }
      })
    })
  )
});




// The activate handler takes care of cleaning up old caches.
// self.addEventListener("activate", (event) => {
//   const currentCaches = [PRECACHE, RUNTIME];
//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return cacheNames.filter(
//           (cacheName) => !currentCaches.includes(cacheName)
//         );
//       })
//       .then((cachesToDelete) => {
//         return Promise.all(
//           cachesToDelete.map((cacheToDelete) => {
//             return caches.delete(cacheToDelete);
//           })
//         );
//       })
//       .then(() => self.clients.claim())
//   );
// });
