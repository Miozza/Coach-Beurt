// Racine — Service worker sans cache applicatif durable.
// Objectif : laisser le réseau servir les nouveaux fichiers et nettoyer les vieux caches.

const CACHE_NAME = "coach-bertin-no-cache";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Pas de cache applicatif ici volontairement.
// Les lectures repassent par le réseau; les écritures/sync GitHub restent intactes.
// Exception : le splash de lancement garde le cache HTTP normal du navigateur
// pour ne pas re-télécharger l'image à chaque ouverture.

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  var isSplashImage = event.request.url.indexOf("racine-splash.webp") !== -1;
  event.respondWith(fetch(event.request, isSplashImage ? {} : { cache: "reload" }));
});
