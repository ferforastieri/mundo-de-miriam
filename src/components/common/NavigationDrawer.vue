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

    <div v-if="isOpen && !isDesktop" class="drawer-backdrop" @click="close"></div>

    <aside
      class="navigation-drawer"
      :class="{ 'is-open': isOpen, 'is-compact': isDesktop && !isOpen }"
      aria-label="Navegação principal"
    >
      <header class="drawer-header">
        <RouterLink
          to="/"
          class="drawer-brand"
          aria-label="Mundo de Miriam — página inicial"
          @click="closeOnNavigation"
        >
          <img src="/apple-touch-icon.png" alt="" />
        </RouterLink>
        <button
          class="drawer-close"
          type="button"
          :aria-label="isOpen ? 'Recolher navegação' : 'Expandir navegação'"
          @click="toggle"
        >
          {{ isOpen ? '‹' : '›' }}
        </button>
      </header>

      <nav class="drawer-links">
        <RouterLink
          v-for="item in links"
          :key="item.to"
          :to="item.to"
          :title="isDesktop && !isOpen ? item.label : undefined"
          @click="closeOnNavigation"
        >
          <svg class="drawer-link-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              v-for="path in item.iconPaths"
              :key="path"
              :d="path"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="drawer-link-label">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <button
        class="drawer-theme"
        type="button"
        :title="!isOpen && isDesktop ? themeLabel : undefined"
        :aria-label="themeLabel"
        @click="emit('toggle-theme')"
      >
        <svg v-if="props.isDark" class="drawer-theme-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>
        <svg v-else class="drawer-theme-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
        </svg>
        <span class="drawer-theme-label">{{ themeLabel }}</span>
      </button>

      <div class="drawer-language">
        <span>Idioma</span>
        <LanguageSwitcher drawer />
      </div>

      <div class="drawer-footer">
        <p>Siga Miriam</p>
        <div class="drawer-socials">
          <a href="https://www.instagram.com/mihforastieri/" target="_blank" rel="noopener noreferrer"><span>Instagram</span></a>
          <a href="https://wa.me/5515991962479" target="_blank" rel="noopener noreferrer"><span>WhatsApp</span></a>
          <a href="mailto:cleresmimakeup@gmail.com"><span>E-mail</span></a>
        </div>
      </div>
    </aside>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const props = defineProps({
  isDark: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:open', 'toggle-theme'])
const desktopMedia = window.matchMedia('(min-width: 769px)')
const isDesktop = ref(desktopMedia.matches)
const isOpen = ref(isDesktop.value)
const themeLabel = computed(() => props.isDark ? 'Ativar modo claro' : 'Ativar modo escuro')
const links = [
  { to: '/', label: 'Início', iconPaths: ['M3 11.5 12 4l9 7.5', 'M5.5 10v10h13V10', 'M9.5 20v-6h5v6'] },
  { to: '/about', label: 'Sobre mim', iconPaths: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M4.5 21a7.5 7.5 0 0 1 15 0'] },
  { to: '/curriculum', label: 'Currículo', iconPaths: ['M6 3h9l3 3v15H6Z', 'M15 3v4h4', 'M9 11h6', 'M9 15h6'] },
  { to: '/beauty-portfolio', label: 'Portfólio Beauty', iconPaths: ['m12 3 1.2 4.1L17 9l-3.8 1.9L12 15l-1.2-4.1L7 9l3.8-1.9Z', 'M5 15.5 5.7 18l2.3.8-2.3.7L5 22l-.7-2.5-2.3-.7 2.3-.8Z'] },
  { to: '/artistic-portfolio', label: 'Portfólio Artístico', iconPaths: ['M12 3a9 9 0 0 0 0 18h1.2a1.8 1.8 0 0 0 0-3.6h-.7a1.6 1.6 0 0 1 0-3.2H16a5 5 0 0 0 5-5C21 5.8 17 3 12 3Z', 'M7.5 10h.01', 'M9 6.8h.01', 'M13 6h.01', 'M16.5 8h.01'] },
  { to: '/ecommerce', label: 'Fotografia E-commerce', iconPaths: ['M4 7h4l1.5-2h5L16 7h4v12H4Z', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'] },
  { to: '/partnerships', label: 'Parcerias', iconPaths: ['M8.5 12.5 12 16l3.5-3.5', 'm3 9 4-4 5 5', 'm21 9-4-4-3 3', 'M7 17l2 2a2 2 0 0 0 3 0l5-5'] }
]

const open = () => { isOpen.value = true }
const close = () => { isOpen.value = false }
const toggle = () => { isOpen.value = !isOpen.value }
const closeOnNavigation = () => {
  if (!isDesktop.value) close()
}

const handleViewportChange = (event) => {
  isDesktop.value = event.matches
  isOpen.value = event.matches
}

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

watch([isOpen, isDesktop], ([open, desktop]) => {
  setPageScrollLocked(open && !desktop)
})
watch(isOpen, (open) => emit('update:open', open), { immediate: true })

onMounted(() => {
  desktopMedia.addEventListener('change', handleViewportChange)
})

onBeforeUnmount(() => {
  desktopMedia.removeEventListener('change', handleViewportChange)
  setPageScrollLocked(false)
})
</script>

<style>
.drawer-trigger{position:fixed;top:max(12px,calc(env(safe-area-inset-top) + 9px));left:max(12px,env(safe-area-inset-left));z-index:10002;display:grid;gap:4px;width:42px;height:42px;padding:11px 10px;border:1px solid rgba(85,34,0,.2);border-radius:50%;background:#fff;color:#552200;box-shadow:0 8px 20px rgba(85,34,0,.16);cursor:pointer}.drawer-trigger span{display:block;height:2px;background:currentColor;border-radius:2px}.drawer-backdrop{position:fixed;inset:0;z-index:10003;background:rgba(31,15,7,.38);backdrop-filter:blur(2px)}.navigation-drawer{position:fixed;top:0;bottom:0;left:0;z-index:10004;display:flex;flex-direction:column;width:min(84vw,340px);padding:max(20px,env(safe-area-inset-top)) 1.5rem 1.5rem;background:#fff;color:#552200;box-shadow:12px 0 40px rgba(31,15,7,.2);transform:translateX(-105%);transition:transform .26s ease}.navigation-drawer.is-open{transform:translateX(0)}.drawer-header{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-bottom:1.25rem;border-bottom:1px solid rgba(85,34,0,.16)}.drawer-brand{display:inline-flex;color:inherit;text-decoration:none}.drawer-brand img{width:44px;height:44px;border-radius:50%;box-shadow:0 3px 10px rgba(85,34,0,.18)}.drawer-close{width:36px;height:36px;border:0;border-radius:50%;background:#f6efeb;color:inherit;font-size:1.7rem;line-height:1;cursor:pointer}.drawer-links{display:grid;gap:.25rem;padding:1.25rem 0}.drawer-links a{display:flex;align-items:center;gap:.75rem;padding:.8rem .2rem;color:inherit;font-size:1rem;text-decoration:none;border-bottom:1px solid rgba(85,34,0,.1)}.drawer-links a.router-link-active{font-weight:bold}.drawer-language{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 0}.drawer-language>span{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}.drawer-footer{margin-top:auto;padding-top:1rem;border-top:1px solid rgba(85,34,0,.16)}.drawer-footer p{margin:0 0 .7rem;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}.drawer-socials{display:flex;flex-wrap:wrap;gap:.55rem}.drawer-socials a{color:inherit;font-size:.82rem;text-decoration:none;border-bottom:1px solid currentColor}@media (prefers-reduced-motion:reduce){.navigation-drawer{transition:none}}
.drawer-link-icon{flex:0 0 auto;width:22px;height:22px}.drawer-theme{display:none;align-items:center;gap:.75rem;width:100%;padding:.8rem .65rem;border:1px solid var(--border);border-radius:10px;background:var(--surface-muted);color:var(--primary);font:inherit;cursor:pointer;transition:background .2s ease,color .2s ease}.drawer-theme:hover{background:var(--primary);color:var(--on-primary)}.drawer-theme-icon{flex:0 0 auto;width:22px;height:22px}.drawer-theme-label{text-align:left}

html[data-theme="dark"] .navigation-drawer{background:var(--surface);color:var(--text);border-color:var(--border)}html[data-theme="dark"] .drawer-header,html[data-theme="dark"] .drawer-links a,html[data-theme="dark"] .drawer-footer{border-color:var(--border)}html[data-theme="dark"] .drawer-close{background:var(--surface-muted);color:var(--primary)}

@media (max-width:768px){.drawer-trigger{z-index:10006}.drawer-backdrop{z-index:10007}.navigation-drawer{z-index:10008}}
@media (min-width:769px){.drawer-trigger{display:none}.navigation-drawer{top:0;width:var(--desktop-drawer-width);padding:0 1rem 1.25rem;border-right:1px solid rgba(85,34,0,.16);box-shadow:none;overflow-y:auto;transform:translateX(0);transition:width .26s ease,padding .26s ease}.drawer-header{height:calc(68px + env(safe-area-inset-top));padding:env(safe-area-inset-top) 0 0}.drawer-theme{display:flex}.navigation-drawer.is-compact{width:var(--desktop-drawer-collapsed-width);padding-right:.65rem;padding-left:.65rem}.navigation-drawer.is-compact .drawer-header{justify-content:center}.navigation-drawer.is-compact .drawer-brand,.navigation-drawer.is-compact .drawer-link-label,.navigation-drawer.is-compact .drawer-theme-label,.navigation-drawer.is-compact .drawer-language,.navigation-drawer.is-compact .drawer-footer{display:none}.navigation-drawer.is-compact .drawer-links a{justify-content:center;padding:.8rem 0}.navigation-drawer.is-compact .drawer-theme{justify-content:center;padding:.8rem 0}.navigation-drawer.is-compact .drawer-close{display:grid;place-items:center}}
</style>
