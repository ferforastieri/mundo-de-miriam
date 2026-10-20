<template>
  <section v-if="visible" class="app-install">
    <button class="app-install__close" type="button" aria-label="Fechar convite" @click="dismiss">
      ×
    </button>

    <div class="app-install__brand">
      <img src="/pwa-icon-192.png" alt="" />
      <span class="app-install__name">Mundo de Miriam</span>
    </div>

    <div class="app-install__copy">
      <span class="app-install__eyebrow">Aplicativo</span>
      <h2 class="app-install__title">Leve o Mundo de Miriam com você</h2>
      <p v-if="isIos" class="app-install__text">
        No iPhone, toque em <strong>Compartilhar</strong> e depois em
        <strong>Adicionar à Tela de Início</strong>.
      </p>
      <p v-else class="app-install__text">
        Instale no seu celular e abra as galerias direto da tela inicial, em tela cheia.
      </p>
    </div>

    <button v-if="!isIos" class="app-install__button" type="button" @click="install">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Instalar aplicativo
    </button>
  </section>
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

function onBeforeInstall() {
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
  isIos.value =
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
    !window.MSStream

  deferredPrompt.value = window.__mdmInstallPrompt || null
  window.addEventListener('mdm-install-available', onBeforeInstall)
  window.addEventListener('appinstalled', onInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('mdm-install-available', onBeforeInstall)
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
.app-install {
  position: relative;
  display: grid;
  gap: 0.75rem;
  margin: 0 0 2rem;
  padding: 1.25rem 1.4rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.app-install__close {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
}

.app-install__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.app-install__brand img {
  width: 40px;
  height: 40px;
  border-radius: 9px;
}

.app-install__name {
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: 1rem;
}

.app-install__eyebrow {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.app-install__title {
  margin: 0.2rem 0 0.35rem;
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: normal;
}

.app-install__text {
  margin: 0;
  max-width: 560px;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.88rem;
  line-height: 1.5;
}

.app-install__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  justify-self: start;
  min-height: 40px;
  padding: 0.55rem 1.1rem;
  border: 2px solid var(--primary);
  border-radius: 10px;
  background: var(--primary);
  color: var(--on-primary);
  font-family: 'Gilda Display', serif;
  font-size: 0.92rem;
  letter-spacing: 0.03em;
  cursor: pointer;
}

.app-install__button svg {
  width: 17px;
  height: 17px;
}

.app-install__button:hover {
  filter: brightness(0.94);
}

@media (max-width: 560px) {
  .app-install {
    padding: 1rem;
  }

  .app-install__button {
    width: 100%;
  }
}
</style>
