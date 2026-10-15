// Inkline service worker: shows a phone notification when a new class assignment is posted.
try {
  importScripts(
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js',
    'firebase-config.js'
  );
} catch (e) {}

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

const cfg = self.FIREBASE_CONFIG;
if (self.firebase && cfg && !/^PASTE/.test(String(cfg.apiKey || ''))) {
  try {
    firebase.initializeApp(cfg);
    firebase.messaging().onBackgroundMessage(payload => {
      const d = payload.data || {};
      return self.registration.showNotification(d.title || 'Inkline', {
        body: d.body || 'A new class assignment was posted.',
        icon: 'icons/icon-192.png',
        badge: 'icons/badge-96.png',
        tag: d.tag || 'inkline',
        data: { url: d.url || './' }
      });
    });
  } catch (e) {}
}

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus();
    return clients.openWindow(url);
  }));
});
