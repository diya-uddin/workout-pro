// Service Worker for Workout Pro Notifications
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  return self.clients.claim();
});

// รับสัญญาณ Push จากระบบแจ้งเตือน
self.addEventListener('push', (event) => {
  let data = { title: 'ได้เวลาออกกำลังกายแล้ว!', body: 'ได้เวลาฝึกตามตารางของคุณแล้ว เข้าแอปเลย!' };
  if (event.data) {
    try { data = event.data.json(); } catch (e) { data.body = event.data.text(); }
  }

  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/2548/2548537.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2548/2548537.png',
    vibrate: [200, 100, 200, 100, 400],
    actions: [
      { action: 'start', title: 'เริ่มออกกำลังกาย' },
      { action: 'skip', title: 'ไม่ออกกำลังกาย' }
    ]
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
