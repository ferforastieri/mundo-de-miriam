/* Service worker mínimo: habilita a instalação do PWA sem interceptar respostas. */
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', () => {
  // Passa direto: o navegador segue com a rede normalmente.
})
