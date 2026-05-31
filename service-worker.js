const CACHE_NAME = 'coach-bertin-v49.1';
const FILES = [
  './', './index.html', './styles.css', './app.js', './manifest.json',
  './programs/index.js', './programs/epaules_3d.js',
  './programs/crossfit_maintenance.js', './programs/posture_cyphose.js',
  './programs/force.js', './programs/hypertrophy_base.js',
  './programs/force_performance.js', './programs/competition_peak.js',
  './programs/config.js', './programs/workouts.js', './programs/tutorials.js'
];
const OPTIONAL_FILES = ['./data/charges.js', './charges.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async c => {
      await c.addAll(FILES);
      await Promise.all(OPTIONAL_FILES.map(async url => {
        try {
          const resp = await fetch(url, { cache: 'no-store' });
          if (resp && resp.ok) await c.put(url, resp.clone());
        } catch (_) {}
      }));
    })
  );
  self.skipWaiting();
});
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
