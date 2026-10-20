import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './style.css'
import './style/admin.css'

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  window.__mdmInstallPrompt = event
  window.dispatchEvent(new Event('mdm-install-available'))
})

const app = createApp(App)
app.use(VueQueryPlugin)
app.use(router)
app.use(i18n)
app.mount('#app')

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
