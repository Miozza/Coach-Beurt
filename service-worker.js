const CACHE_NAME = 'coach-bertin-v45';
const FILES = [
  './', './index.html', './styles.css', './app.js', './charges.js', './manifest.json',
  './data/programs/index.js', './data/programs/epaules_3d.js',
  './data/programs/crossfit_maintenance.js', './data/programs/posture_cyphose.js',
  './data/programs/force.js', './data/programs/hypertrophy_base.js',
  './data/programs/force_performance.js', './data/programs/competition_peak.js'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
