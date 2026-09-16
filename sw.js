/**
 * Trainlog service worker — self-updating.
 *
 * The app shell is fetched network-first, so a new version on GitHub is
 * noticed on the next launch without anyone bumping a cache name. Icons and
 * the manifest stay cache-first because they never change.
 *
 * When a new version finishes installing it WAITS rather than taking over
 * mid-workout. The app shows a banner; tapping it activates and reloads.
 */
const CACHE = 'trainlog';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  // no skipWaiting here on purpose — never swap the app out mid-session
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  const isShell = e.request.mode === 'navigate' || url.pathname.endsWith('index.html');

  if (isShell) {
    // network-first: always try for a newer build, fall back to cache offline
    e.respondWith(
      fetch(e.request)
        .then(r => {
          if (r && r.ok) {
            const copy = r.clone();
            caches.open(CACHE).then(c => c.put('./index.html', copy));
          }
          return r;
        })
        .catch(() => caches.match('./index.html').then(hit => hit || caches.match('./')))
    );
    return;
  }

  // everything else: cache-first, refreshed quietly in the background
  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request).then(r => {
        if (r && r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone()));
        return r;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
