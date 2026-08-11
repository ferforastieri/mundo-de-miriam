<template>
  <Teleport to="body">
    <button
      class="drawer-trigger"
      type="button"
      aria-label="Abrir navegação"
      :aria-expanded="isOpen"
      @click="open"
    >
      <span></span><span></span><span></span>
    </button>

    <div v-if="isOpen" class="drawer-backdrop" @click="close"></div>

    <aside
      class="navigation-drawer"
      :class="{ 'is-open': isOpen }"
      aria-label="Navegação principal"
    >
      <header class="drawer-header">
        <RouterLink to="/" class="drawer-brand" @click="close">Mundo de Miriam</RouterLink>
        <button class="drawer-close" type="button" aria-label="Fechar navegação" @click="close">×</button>
      </header>

      <nav class="drawer-links">
        <RouterLink v-for="item in links" :key="item.to" :to="item.to" @click="close">
          <span class="drawer-link-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="drawer-language">
        <span>Idioma</span>
        <LanguageSwitcher drawer />
      </div>

      <div class="drawer-footer">
        <p>Siga Miriam</p>
        <div class="drawer-socials">
          <a href="https://www.instagram.com/mihforastieri/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://wa.me/5515991962479" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="mailto:cleresmimakeup@gmail.com">E-mail</a>
        </div>
      </div>
    </aside>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const isOpen = ref(false)
const links = [
  { to: '/', label: 'Início', icon: '⌂' },
  { to: '/about', label: 'Sobre mim', icon: '◉' },
  { to: '/curriculum', label: 'Currículo', icon: '▤' },
  { to: '/beauty-portfolio', label: 'Portfólio Beauty', icon: '✦' },
  { to: '/artistic-portfolio', label: 'Portfólio Artístico', icon: '◈' },
  { to: '/ecommerce', label: 'Fotografia E-commerce', icon: '▣' },
  { to: '/partnerships', label: 'Parcerias', icon: '♧' }
]

const open = () => { isOpen.value = true }
const close = () => { isOpen.value = false }

let overflowBeforeDrawer
const setPageScrollLocked = (locked) => {
  if (locked) {
    if (overflowBeforeDrawer) return
    overflowBeforeDrawer = {
      body: document.body.style.overflow,
      document: document.documentElement.style.overflow
    }
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    return
  }

  if (!overflowBeforeDrawer) return
  document.body.style.overflow = overflowBeforeDrawer.body
  document.documentElement.style.overflow = overflowBeforeDrawer.document
  overflowBeforeDrawer = undefined
}

watch(isOpen, setPageScrollLocked)
onBeforeUnmount(() => {
  setPageScrollLocked(false)
})
</script>

<style>
.drawer-trigger{position:fixed;top:max(12px,calc(env(safe-area-inset-top) + 9px));left:max(12px,env(safe-area-inset-left));z-index:10002;display:grid;gap:4px;width:42px;height:42px;padding:11px 10px;border:1px solid rgba(85,34,0,.2);border-radius:50%;background:#fff;color:#552200;box-shadow:0 8px 20px rgba(85,34,0,.16);cursor:pointer}.drawer-trigger span{display:block;height:2px;background:currentColor;border-radius:2px}.drawer-backdrop{position:fixed;inset:0;z-index:10003;background:rgba(31,15,7,.38);backdrop-filter:blur(2px)}.navigation-drawer{position:fixed;top:0;bottom:0;left:0;z-index:10004;display:flex;flex-direction:column;width:min(84vw,340px);padding:max(20px,env(safe-area-inset-top)) 1.5rem 1.5rem;background:#fff;color:#552200;box-shadow:12px 0 40px rgba(31,15,7,.2);transform:translateX(-105%);transition:transform .26s ease}.navigation-drawer.is-open{transform:translateX(0)}.drawer-header{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-bottom:1.25rem;border-bottom:1px solid rgba(85,34,0,.16)}.drawer-brand{color:inherit;font-size:1.25rem;letter-spacing:.06em;text-decoration:none}.drawer-close{width:36px;height:36px;border:0;border-radius:50%;background:#f6efeb;color:inherit;font-size:1.7rem;line-height:1;cursor:pointer}.drawer-links{display:grid;gap:.25rem;padding:1.25rem 0}.drawer-links a{display:flex;align-items:center;gap:.75rem;padding:.8rem .2rem;color:inherit;font-size:1rem;text-decoration:none;border-bottom:1px solid rgba(85,34,0,.1)}.drawer-links a.router-link-active{font-weight:bold}.drawer-link-icon{display:grid;width:1.35rem;place-items:center;font-size:1.15rem;color:currentColor}.drawer-language{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 0;border-top:1px solid rgba(85,34,0,.16)}.drawer-language>span{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}.drawer-footer{margin-top:auto;padding-top:1rem;border-top:1px solid rgba(85,34,0,.16)}.drawer-footer p{margin:0 0 .7rem;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}.drawer-socials{display:flex;flex-wrap:wrap;gap:.55rem}.drawer-socials a{color:inherit;font-size:.82rem;text-decoration:none;border-bottom:1px solid currentColor}@media (prefers-reduced-motion:reduce){.navigation-drawer{transition:none}}
</style>
