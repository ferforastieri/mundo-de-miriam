<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useRoute } from 'vue-router'
import LanguageSwitcher from './components/common/LanguageSwitcher.vue'
import NavigationDrawer from './components/common/NavigationDrawer.vue'

const isDark = ref(false)
const showScrollCue = ref(false)
const currentYear = new Date().getFullYear()
const route = useRoute()

const applyTheme = (dark) => {
  isDark.value = dark
  document.documentElement.dataset.theme = dark ? "dark" : "light"
  localStorage.setItem("themePreference", dark ? "dark" : "light")
}

const toggleTheme = () => applyTheme(!isDark.value)

const getScrollTarget = () => (
  document.querySelector('.portfolio-layout, .partnerships-layout') || document.scrollingElement
)

const getScrollMetrics = () => {
  const target = getScrollTarget()
  const isDocument = target === document.documentElement || target === document.body

  return {
    target,
    isDocument,
    top: isDocument ? window.scrollY : target?.scrollTop || 0,
    viewport: isDocument ? window.innerHeight : target?.clientHeight || window.innerHeight,
    height: isDocument ? document.documentElement.scrollHeight : target?.scrollHeight || 0
  }
}

const updateScrollCue = () => {
  if (window.innerWidth > 768) {
    showScrollCue.value = false
    return
  }

  const { top, viewport, height } = getScrollMetrics()
  showScrollCue.value = height > viewport + 48 && top + viewport < height - 48
}

const scrollForward = () => {
  const { target, isDocument, viewport } = getScrollMetrics()
  const options = { top: Math.round(viewport * 0.72), behavior: 'smooth' }

  if (isDocument) {
    window.scrollBy(options)
    return
  }

  target?.scrollBy(options)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('themePreference')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark)

  window.addEventListener('scroll', updateScrollCue, true)
  window.addEventListener('resize', updateScrollCue)
  document.addEventListener('load', updateScrollCue, true)
  requestAnimationFrame(updateScrollCue)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollCue, true)
  window.removeEventListener('resize', updateScrollCue)
  document.removeEventListener('load', updateScrollCue, true)
})

watch(() => route.fullPath, async () => {
  showScrollCue.value = false
  await nextTick()
  requestAnimationFrame(updateScrollCue)
})
</script>

<template>
  <div class="app">
    <footer class="site-dock" aria-label="Navegação e preferências">
      <div class="site-dock__left">
        <NavigationDrawer
          :is-dark="isDark"
          @toggle-theme="toggleTheme"
        />
      </div>
      <nav class="site-mobile-links" aria-label="Atalhos principais">
        <RouterLink to="/" aria-label="Início">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 11.5 12 4l8.5 7.5M5.5 10v10h13V10M9.5 20v-6h5v6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <span>Início</span>
        </RouterLink>
        <RouterLink to="/beauty-portfolio" aria-label="Portfólio Beauty">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" stroke-width="1.7" /><path d="m5 16 4.2-4.2 3.2 3.1 2.2-2.2L19 17M16.8 8.5h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <span>Beauty</span>
        </RouterLink>
        <RouterLink to="/artistic-portfolio" class="mobile-link--artistic" aria-label="Portfólio Artístico">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18h1.2a1.8 1.8 0 0 0 0-3.6h-.7a1.6 1.6 0 0 1 0-3.2H16a5 5 0 0 0 5-5C21 5.8 17 3 12 3Z" stroke="currentColor" stroke-width="1.7" /><path d="M7.5 10h.01M9 6.8h.01M13 6h.01M16.5 8h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
          <span>Artístico</span>
        </RouterLink>
        <RouterLink to="/ecommerce" class="mobile-link--ecommerce" aria-label="Fotografia E-commerce">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h4l1.5-2h5L16 7h4v12H4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" /><circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="1.7" /></svg>
          <span>E-commerce</span>
        </RouterLink>
        <RouterLink to="/partnerships" class="mobile-link--partnerships" aria-label="Parcerias">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.5 12.5 12 16l3.5-3.5M3 9l4-4 5 5M21 9l-4-4-3 3M7 17l2 2a2 2 0 0 0 3 0l5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <span>Parcerias</span>
        </RouterLink>
      </nav>
      <nav class="site-desktop-links" aria-label="Atalhos principais">
        <RouterLink to="/" class="desktop-link--base" aria-label="Início">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 11.5 12 4l8.5 7.5M5.5 10v10h13V10M9.5 20v-6h5v6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <span>Início</span>
        </RouterLink>
        <RouterLink to="/about" class="desktop-link--base" aria-label="Sobre mim">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.7" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /></svg>
          <span>Sobre</span>
        </RouterLink>
        <RouterLink to="/beauty-portfolio" class="desktop-link--base" aria-label="Portfólio Beauty">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" stroke-width="1.7" /><path d="m5 16 4.2-4.2 3.2 3.1 2.2-2.2L19 17M16.8 8.5h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <span>Beauty</span>
        </RouterLink>
        <RouterLink to="/curriculum" class="desktop-link--curriculum" aria-label="Currículo">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h9l3 3v15H6Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" /><path d="M15 3v4h4M9 11h6M9 15h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /></svg>
          <span>Currículo</span>
        </RouterLink>
        <RouterLink to="/artistic-portfolio" class="desktop-link--artistic" aria-label="Portfólio Artístico">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18h1.2a1.8 1.8 0 0 0 0-3.6h-.7a1.6 1.6 0 0 1 0-3.2H16a5 5 0 0 0 5-5C21 5.8 17 3 12 3Z" stroke="currentColor" stroke-width="1.7" /><path d="M7.5 10h.01M9 6.8h.01M13 6h.01M16.5 8h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
          <span>Artístico</span>
        </RouterLink>
        <RouterLink to="/ecommerce" class="desktop-link--ecommerce" aria-label="Fotografia E-commerce">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h4l1.5-2h5L16 7h4v12H4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" /><circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="1.7" /></svg>
          <span>E-commerce</span>
        </RouterLink>
        <RouterLink to="/partnerships" class="desktop-link--partnerships" aria-label="Parcerias">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.5 12.5 12 16l3.5-3.5M3 9l4-4 5 5M21 9l-4-4-3 3M7 17l2 2a2 2 0 0 0 3 0l5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <span>Parcerias</span>
        </RouterLink>
        <span class="site-desktop-copyright">
          <span class="site-desktop-copyright__mark" aria-hidden="true">©</span>
          <span>{{ currentYear }} Miriam</span>
        </span>
      </nav>
      <div class="site-dock__right">
        <div class="site-desktop-socials" aria-label="Contato e redes sociais">
          <a
            class="site-desktop-socials__prompt"
            href="https://wa.me/5515991962479"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vamos conversar pelo WhatsApp"
          >
            <span class="site-desktop-socials__prompt-text">Vamos conversar</span>
            <i class="site-desktop-socials__prompt-arrow">→</i>
          </a>
          <a href="https://wa.me/5515991962479" target="_blank" rel="noopener noreferrer" aria-label="Falar pelo WhatsApp" title="WhatsApp">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 11.6a8 8 0 0 1-11.8 7l-4.2 1.1 1.1-4A8 8 0 1 1 20 11.6Z" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round" />
              <path d="M9 8.2c.3 2.7 2.2 4.7 4.9 5.3l1.1-1.1c.2-.2.5-.3.8-.1l1.6.7c.3.1.4.4.4.7-.2 1.2-1.3 2-2.5 1.9-4.5-.5-8.1-4-8.5-8.5-.1-1.2.7-2.3 1.9-2.5.3 0 .6.1.7.4l.7 1.6c.1.3.1.6-.1.8Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <a href="mailto:cleresmimakeup@gmail.com" aria-label="Enviar e-mail" title="E-mail">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.7" />
              <path d="m5 7 7 5 7-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <a href="https://instagram.com/mihforastieri" target="_blank" rel="noopener noreferrer" aria-label="Abrir Instagram" title="Instagram">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.7" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7" />
              <circle cx="17.3" cy="6.8" r="1" fill="currentColor" />
            </svg>
          </a>
        </div>
        <button class="header-icon-button" type="button" :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'" @click="toggleTheme">
          <span aria-hidden="true">{{ isDark ? '☀' : '☾' }}</span>
        </button>
        <LanguageSwitcher embedded />
      </div>
    </footer>
    <main class="site-page">
      <router-view />
    </main>
    <button
      v-show="showScrollCue"
      class="global-scroll-cue"
      type="button"
      aria-label="Rolar para o próximo conteúdo"
      @click="scrollForward"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m6.5 9 5.5 5.5L17.5 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
}

.site-dock {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10005;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  width: 100%;
  height: calc(68px + env(safe-area-inset-bottom));
  margin: 0;
  box-sizing: border-box;
  padding: 7px max(16px, env(safe-area-inset-right)) max(7px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  background: var(--surface);
  border: 0;
  border-top: 1px solid var(--border);
  border-radius: 0;
  box-shadow: none;
}

.site-dock__left,
.site-dock__right {
  display: flex;
  align-items: center;
}

.site-dock__left { justify-content: flex-start; }

.site-dock__right {
  justify-content: flex-end;
  gap: 8px;
}

.site-dock__right > * {
  flex: 0 0 42px;
}

.site-dock__right > .site-desktop-socials { flex: 0 0 auto; }

.site-desktop-socials {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 0.45rem;
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}

.site-desktop-socials__prompt {
  --contact-card-pulse: rgba(111, 47, 24, 0.12);
  display: none;
  align-items: center;
  gap: 0.35rem;
  margin-right: 0.55rem;
  padding: 0.48rem 0.7rem;
  color: var(--muted);
  background-color: var(--surface-muted);
  background-image: linear-gradient(105deg, transparent 28%, var(--contact-card-pulse) 48%, transparent 68%);
  background-position: 125% 0;
  background-size: 280% 100%;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: system-ui, sans-serif;
  font-size: 0.84rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-decoration: none;
  white-space: nowrap;
}

.site-desktop-socials__prompt-arrow { color: #6f2f18; font-size: 1.05rem; font-style: normal; line-height: 1; }

.site-desktop-socials__prompt-text {
  color: inherit;
}

:global(html[data-theme="dark"] .site-desktop-socials__prompt) {
  --contact-card-pulse: rgba(225, 161, 127, 0.16);
}

:global(html[data-theme="dark"] .site-desktop-socials__prompt-arrow) {
  color: #e1a17f;
}

.site-desktop-socials > a:not(.site-desktop-socials__prompt) {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  color: var(--muted);
  border-radius: 50%;
  text-decoration: none;
}

.site-desktop-socials > a:not(.site-desktop-socials__prompt):hover { color: var(--primary); }
.site-desktop-socials > a:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.site-desktop-socials > a:not(.site-desktop-socials__prompt) svg { width: 20px; height: 20px; }
.site-desktop-socials__prompt:hover { color: var(--text); border-color: #6f2f18; }

@media (min-width: 769px) and (prefers-reduced-motion: no-preference) {
  .site-desktop-socials__prompt { animation: contact-card-pulse 2.2s linear infinite; }

  @keyframes contact-card-pulse {
    from { background-position: 125% 0; }
    to { background-position: -35% 0; }
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-desktop-socials__prompt { background-image: none; }
}

.site-mobile-links { display: none; }

.site-desktop-links {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  gap: clamp(0.7rem, 1.5vw, 1.5rem);
  font-family: system-ui, sans-serif;
  font-size: 0.58rem;
  letter-spacing: 0.04em;
}

.site-desktop-links a {
  display: none;
  min-width: 54px;
  padding: 0.2rem 0.25rem;
  justify-items: center;
  gap: 0.12rem;
  color: var(--muted);
  text-decoration: none;
  white-space: nowrap;
}

.site-desktop-links svg { width: 21px; height: 21px; }
.site-desktop-links a.desktop-link--base { display: grid; }
.site-desktop-links a.router-link-exact-active { color: var(--primary); }
.site-desktop-copyright {
  display: none;
  min-width: 54px;
  justify-items: center;
  gap: 0.12rem;
  color: var(--muted);
  line-height: 1;
  white-space: nowrap;
}
.site-desktop-copyright__mark { height: 21px; font-size: 1.15rem; line-height: 21px; }

.header-icon-button {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgba(85, 34, 0, 0.2);
  border-radius: 50%;
  background: var(--surface);
  color: var(--primary);
  font-size: 1.35rem;
  cursor: pointer;
}

.header-icon-button:hover {
  background: var(--primary);
  color: var(--on-primary);
}

.site-page {
  min-height: 100vh;
  padding-bottom: calc(68px + env(safe-area-inset-bottom));
}

.global-scroll-cue { display: none; }

@media (max-width: 768px) {
  .site-dock {
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    grid-template-columns: 58px 1fr auto;
    gap: 0;
    height: calc(76px + env(safe-area-inset-bottom));
    padding: 7px max(12px, env(safe-area-inset-right)) max(7px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
    border-width: 1px 0 0;
    border-radius: 0;
    box-shadow: none;
  }

  .site-dock__left { grid-column: 1; justify-content: flex-start; }
  .site-mobile-links {
    grid-column: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(0.2rem, 1.5vw, 0.65rem);
  }
  .site-mobile-links a {
    display: grid;
    min-width: 50px;
    justify-items: center;
    gap: 0.15rem;
    color: var(--muted);
    font-family: system-ui, sans-serif;
    font-size: 0.58rem;
    letter-spacing: 0.04em;
    text-decoration: none;
  }
  .site-mobile-links svg { width: 22px; height: 22px; }
  .site-mobile-links a.router-link-exact-active,
  .site-mobile-links a.router-link-active { color: var(--primary); }
  .site-mobile-links :is(.mobile-link--artistic, .mobile-link--ecommerce, .mobile-link--partnerships) { display: none; }
  .site-desktop-links { display: none; }
  .site-desktop-socials { display: none; }
  .site-dock__right { grid-column: 3; }

  .site-page { padding-bottom: calc(76px + env(safe-area-inset-bottom)); }

  .global-scroll-cue {
    position: fixed;
    right: 50%;
    bottom: calc(88px + env(safe-area-inset-bottom));
    z-index: 10004;
    display: grid;
    width: 34px;
    height: 34px;
    padding: 0;
    place-items: center;
    color: var(--primary);
    background: color-mix(in srgb, var(--surface) 92%, transparent);
    border: 1px solid var(--border);
    border-radius: 50%;
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.14);
    cursor: pointer;
    transform: translateX(50%);
    backdrop-filter: blur(10px);
  }

  .global-scroll-cue svg { width: 22px; height: 22px; }
  .global-scroll-cue:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
}

@media (max-width: 768px) and (prefers-reduced-motion: no-preference) {
  .global-scroll-cue { animation: global-scroll-cue 1.35s ease-in-out infinite; }

  @keyframes global-scroll-cue {
    0%, 100% { opacity: 0.4; transform: translate(50%, -2px); }
    50% { opacity: 1; transform: translate(50%, 3px); }
  }
}

@media (min-width: 380px) and (max-width: 768px) {
  .site-mobile-links .mobile-link--artistic { display: grid; }
}

@media (min-width: 520px) and (max-width: 768px) {
  .site-mobile-links .mobile-link--ecommerce { display: grid; }
}

@media (min-width: 640px) and (max-width: 768px) {
  .site-mobile-links .mobile-link--partnerships { display: grid; }
}

@media (min-width: 900px) {
  .site-desktop-links .desktop-link--curriculum { display: grid; }
}

@media (min-width: 1000px) {
  .site-desktop-socials__prompt { display: inline-flex; }
}

@media (min-width: 1050px) {
  .site-desktop-links .desktop-link--artistic { display: grid; }
}

@media (min-width: 1200px) {
  .site-desktop-links .desktop-link--ecommerce { display: grid; }
}

@media (min-width: 1350px) {
  .site-desktop-links .desktop-link--partnerships { display: grid; }
}

@media (min-width: 1720px) {
  .site-desktop-copyright { display: grid; }
}
</style>
