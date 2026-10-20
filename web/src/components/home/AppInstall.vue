<template>
  <Transition name="pwa-toast">
    <aside v-if="visible" class="pwa-toast" role="status">
      <img class="pwa-toast__icon" src="/pwa-icon-192.png" alt="" />

      <div class="pwa-toast__copy">
        <strong>Instale o Mundo de Miriam</strong>
        <span v-if="isIos">No iPhone: Compartilhar → Adicionar à Tela de Início.</span>
        <span v-else>Abra as galerias direto da tela inicial, em tela cheia.</span>
      </div>

      <button v-if="!isIos" class="pwa-toast__action" type="button" @click="install">
        Instalar
      </button>

      <button class="pwa-toast__close" type="button" aria-label="Fechar convite" @click="dismiss">
        ×
      </button>
    </aside>
  </Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const DISMISS_KEY = 'mdm-pwa-dismissed'

const deferredPrompt = ref(null)
const installed = ref(false)
const dismissed = ref(false)
const isIos = ref(false)

const visible = computed(
  () => !installed.value && !dismissed.value && (Boolean(deferredPrompt.value) || isIos.value)
)

function onInstallAvailable() {
  deferredPrompt.value = window.__mdmInstallPrompt || null
}

function onInstalled() {
  installed.value = true
  deferredPrompt.value = null
}

onMounted(() => {
  dismissed.value = localStorage.getItem(DISMISS_KEY) === '1'
  installed.value =
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  isIos.value = /iPad|iPhone|iPod/.test(window.navigator.userAgent)
  deferredPrompt.value = window.__mdmInstallPrompt || null

  window.addEventListener('mdm-install-available', onInstallAvailable)
  window.addEventListener('appinstalled', onInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('mdm-install-available', onInstallAvailable)
  window.removeEventListener('appinstalled', onInstalled)
})

async function install() {
  const prompt = deferredPrompt.value

  if (!prompt) return

  prompt.prompt()
  await prompt.userChoice.catch(() => null)
  deferredPrompt.value = null
}

function dismiss() {
  dismissed.value = true
  localStorage.setItem(DISMISS_KEY, '1')
}
</script>

<style scoped>
.pwa-toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9000;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: min(400px, calc(100vw - 2rem));
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.18);
}

.pwa-toast__icon {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: 10px;
}

.pwa-toast__copy {
  display: grid;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
}

.pwa-toast__copy strong {
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: 0.98rem;
  font-weight: normal;
}

.pwa-toast__copy span {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.76rem;
  line-height: 1.35;
}

.pwa-toast__action {
  flex: 0 0 auto;
  min-height: 36px;
  padding: 0.4rem 0.9rem;
  border: 2px solid var(--primary);
  border-radius: 9px;
  background: transparent;
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: 0.85rem;
  font-weight: normal;
  line-height: 1.1;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.pwa-toast__action:hover {
  background: var(--primary);
  color: var(--on-primary);
}

.pwa-toast__action:active {
  transform: translateY(1px);
}

.pwa-toast__action:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.pwa-toast__close {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1;
  cursor: pointer;
}

.pwa-toast__close:hover {
  background: var(--surface-muted);
}

@media (max-width: 720px) {
  .pwa-toast {
    top: 0.75rem;
    right: 0.75rem;
    left: 0.75rem;
    width: auto;
  }

  .pwa-toast__copy strong {
    font-size: 0.92rem;
  }
}

.pwa-toast-enter-active,
.pwa-toast-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.pwa-toast-enter-from,
.pwa-toast-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
