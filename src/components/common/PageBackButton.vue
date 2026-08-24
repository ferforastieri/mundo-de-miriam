<template>
  <button class="page-back-button" type="button" aria-label="Voltar para a página anterior" @click="goBack">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m14.5 5-7 7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span><TranslatableText text="Voltar" /></span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import TranslatableText from './TranslatableText.vue'

const router = useRouter()

const goBack = () => {
  if (window.history.state?.back) {
    router.back()
    return
  }

  router.push('/')
}
</script>

<style scoped>
.page-back-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.45rem;
  min-height: 42px;
  padding: 0.6rem 0.85rem;
  color: var(--primary);
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-family: system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.page-back-button svg { width: 18px; height: 18px; }
.page-back-button:hover { color: var(--on-primary); background: var(--primary); transform: translateX(-2px); }
.page-back-button:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }

@media (max-width: 480px) {
  .page-back-button { width: 40px; min-height: 40px; justify-content: center; padding: 0; }
  .page-back-button span { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
}
</style>
