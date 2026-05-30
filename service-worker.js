const CACHE_NAME = 'coach-bertin-v39-progression-semaine-unique';
const FILES = ['./','./index.html','./styles.css','./app.js','./charges.js','./manifest.json','./data/programs/index.js','./data/programs/epaules_3d.js','./data/programs/crossfit_maintenance.js','./data/programs/posture_cyphose.js','./data/programs/force.js'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
