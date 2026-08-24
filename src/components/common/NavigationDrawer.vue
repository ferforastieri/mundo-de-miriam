<template>
  <button
    ref="triggerButton"
    class="menu-trigger"
    type="button"
    aria-label="Abrir menu"
    :aria-expanded="isOpen"
    aria-controls="editorial-menu"
    @click="open"
  >
    <span class="menu-trigger__mark" aria-hidden="true">
      <span class="menu-trigger__letter">M</span>
      <img src="/apple-touch-icon.png" alt="" />
      <span class="menu-trigger__badge">
        <i></i><i></i><i></i>
      </span>
    </span>
    <span class="menu-trigger__label">Menu</span>
    <span class="menu-trigger__lines" aria-hidden="true"><i></i><i></i></span>
  </button>

  <Teleport to="body">
    <Transition name="editorial-menu">
      <div
        v-if="isOpen"
        id="editorial-menu"
        ref="menuDialog"
        class="editorial-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        tabindex="-1"
        @keydown="handleDialogKeydown"
      >
        <header class="editorial-menu__header">
          <RouterLink to="/" class="editorial-menu__brand" @click="close">
            <span>Mundo de Miriam</span>
            <small>Maquiagem · Fotografia · Beleza</small>
          </RouterLink>
          <button ref="closeButton" class="editorial-menu__close" type="button" aria-label="Fechar menu" @click="close">
            <span>Fechar</span><i aria-hidden="true"></i>
          </button>
        </header>

        <div class="editorial-menu__body">
          <nav class="editorial-menu__links" aria-label="Navegação principal">
            <RouterLink
              v-for="item in links"
              :key="item.to"
              :to="item.to"
              @mouseenter="activePath = item.to"
              @focus="activePath = item.to"
              @click="close"
            >
              <img class="editorial-menu__link-image" :src="item.image" alt="" />
              <small>{{ item.category }}</small>
              <span>{{ item.label }}</span>
              <i aria-hidden="true">↗</i>
            </RouterLink>
          </nav>

          <figure class="editorial-menu__preview" aria-hidden="true">
            <Transition name="preview-image" mode="out-in">
              <img :key="activeItem.image" :src="activeItem.image" alt="" />
            </Transition>
            <figcaption>{{ activeItem.label }}</figcaption>
          </figure>
        </div>

        <footer class="editorial-menu__footer">
          <div class="editorial-menu__socials">
            <a
              href="https://www.instagram.com/mihforastieri/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir Instagram"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.7" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7" />
                <circle cx="17.3" cy="6.8" r="1" fill="currentColor" />
              </svg>
              <span class="editorial-menu__social-label">Instagram</span>
            </a>
            <a
              href="https://wa.me/5515991962479"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conversar pelo WhatsApp"
              title="WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 11.6a8 8 0 0 1-11.8 7l-4.2 1.1 1.1-4A8 8 0 1 1 20 11.6Z" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round" />
                <path d="M9 8.2c.3 2.7 2.2 4.7 4.9 5.3l1.1-1.1c.2-.2.5-.3.8-.1l1.6.7c.3.1.4.4.4.7-.2 1.2-1.3 2-2.5 1.9-4.5-.5-8.1-4-8.5-8.5-.1-1.2.7-2.3 1.9-2.5.3 0 .6.1.7.4l.7 1.6c.1.3.1.6-.1.8Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="editorial-menu__social-label">WhatsApp</span>
            </a>
            <a href="mailto:cleresmimakeup@gmail.com" aria-label="Enviar e-mail" title="E-mail">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.7" />
                <path d="m5 7 7 5 7-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="editorial-menu__social-label">E-mail</span>
            </a>
          </div>
          <div class="editorial-menu__preferences">
            <label>
              <span>Tema</span>
              <StyledSelect v-model="selectedTheme" :options="themeOptions" aria-label="Selecionar tema" />
            </label>
            <div class="editorial-menu__language">
              <span>Idioma</span>
              <LanguageSwitcher drawer />
            </div>
          </div>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LanguageSwitcher from './LanguageSwitcher.vue'
import StyledSelect from './StyledSelect.vue'

const props = defineProps({
  isDark: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-theme'])
const route = useRoute()
const isOpen = ref(false)
const activePath = ref('/beauty-portfolio')
const triggerButton = ref(null)
const closeButton = ref(null)
const menuDialog = ref(null)

const links = [
  { to: '/', label: 'Início', category: 'Boas-vindas', image: '/assets/profile/fotodalinda.jpg' },
  { to: '/about', label: 'Sobre mim', category: 'História', image: '/assets/profile/fotodalinda.jpg' },
  { to: '/curriculum', label: 'Currículo', category: 'Experiência', image: '/assets/profile/fundo-cursos.jpg' },
  { to: '/beauty-portfolio', label: 'Beauty', category: 'Maquiagem', image: '/assets/beautystyle/Beauty%20Style1.jpeg' },
  { to: '/artistic-portfolio', label: 'Artístico', category: 'Criação', image: '/assets/artisticstyle/ArtisticStyle1.jpeg' },
  { to: '/ecommerce', label: 'E-commerce', category: 'Fotografia', image: '/assets/e-commerce/e-comerce1.jpeg' },
  { to: '/partnerships', label: 'Parcerias', category: 'Colaborações', image: '/assets/partnership/chocolashes/chocolashes1.jpeg' }
]

const themeOptions = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' }
]

const selectedTheme = computed({
  get: () => props.isDark ? 'dark' : 'light',
  set: (value) => {
    const wantsDark = value === 'dark'
    if (wantsDark !== props.isDark) emit('toggle-theme')
  }
})

const activeItem = computed(() => links.find((item) => item.to === activePath.value) || links[0])

const open = async () => {
  activePath.value = route.path
  isOpen.value = true
  await nextTick()
  closeButton.value?.focus()
}

const close = () => {
  isOpen.value = false
  nextTick(() => triggerButton.value?.focus())
}

const handleDialogKeydown = (event) => {
  if (event.key === 'Escape') {
    close()
    return
  }

  if (event.key !== 'Tab') return
  const focusable = menuDialog.value?.querySelectorAll('a[href], button:not([disabled])')
  if (!focusable?.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(isOpen, (open) => {
  document.documentElement.classList.toggle('menu-is-open', open)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('menu-is-open')
})
</script>

<style>
.menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  height: 44px;
  padding: 4px 14px 4px 4px;
  color: var(--primary);
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  border: 1px solid var(--border);
  border-radius: 999px;
  box-shadow: none;
  cursor: pointer;
}

.menu-trigger__mark {
  position: relative;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  color: var(--on-primary);
  background: var(--primary);
  border-radius: 50%;
  font-family: 'Gilda Display', serif;
  font-size: 1.3rem;
}

.menu-trigger__mark img,
.menu-trigger__badge { display: none; }

.menu-trigger__label {
  font-family: system-ui, sans-serif;
  font-size: 0.7rem;
  font-weight: 650;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.menu-trigger__lines { display: grid; gap: 4px; width: 16px; }
.menu-trigger__lines i { display: block; height: 1px; background: currentColor; }
.menu-trigger__lines i:last-child { width: 11px; justify-self: end; }

.editorial-menu {
  position: fixed;
  inset: 0;
  z-index: 10020;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-height: 100dvh;
  padding: max(24px, env(safe-area-inset-top)) clamp(22px, 4vw, 64px) max(22px, env(safe-area-inset-bottom));
  color: var(--text);
  background: color-mix(in srgb, var(--surface) 96%, transparent);
  backdrop-filter: blur(20px);
  overflow-y: auto;
}

.editorial-menu__header,
.editorial-menu__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.editorial-menu__header { padding-bottom: 1.25rem; border-bottom: 1px solid var(--border); }
.editorial-menu__brand { display: flex; flex-direction: column; color: inherit; text-decoration: none; }
.editorial-menu__brand span { color: var(--primary); font-size: clamp(1.1rem, 1.5vw, 1.4rem); letter-spacing: 0.08em; }
.editorial-menu__brand small,
.editorial-menu__links small,
.editorial-menu__footer,
.editorial-menu__preferences span {
  font-family: system-ui, sans-serif;
  font-size: 0.66rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}
.editorial-menu__brand small { margin-top: 0.25rem; color: var(--muted); }

.editorial-menu__close {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 0;
  color: inherit;
  background: none;
  border: 0;
  font-family: system-ui, sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  cursor: pointer;
}
.editorial-menu__close i { position: relative; width: 28px; height: 28px; border: 1px solid var(--border); border-radius: 50%; }
.editorial-menu__close i::before,
.editorial-menu__close i::after { content: ''; position: absolute; top: 13px; left: 7px; width: 13px; height: 1px; background: currentColor; transform: rotate(45deg); }
.editorial-menu__close i::after { transform: rotate(-45deg); }

.editorial-menu__body {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.65fr);
  gap: clamp(3rem, 8vw, 9rem);
  align-items: center;
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: clamp(2rem, 4vh, 4rem) 0;
}

.editorial-menu__links { display: grid; }
.editorial-menu__link-image { display: none; }
.editorial-menu__links a {
  display: grid;
  grid-template-columns: clamp(86px, 11vw, 142px) 1fr auto;
  align-items: baseline;
  gap: 1rem;
  padding: clamp(0.35rem, 0.9vh, 0.75rem) 0;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  text-decoration: none;
}
.editorial-menu__links small { color: var(--muted); }
.editorial-menu__links span { font-size: clamp(2rem, 5.2vw, 5rem); line-height: 0.95; letter-spacing: -0.035em; transition: color 0.2s ease, transform 0.25s ease; }
.editorial-menu__links i { color: var(--muted); font-family: system-ui, sans-serif; font-style: normal; opacity: 0; transform: translate(-8px, 8px); transition: opacity 0.2s ease, transform 0.2s ease; }
.editorial-menu__links a:hover span,
.editorial-menu__links a:focus-visible span,
.editorial-menu__links a.router-link-active span { color: var(--primary); transform: translateX(0.3rem); }
.editorial-menu__links a:hover i,
.editorial-menu__links a:focus-visible i { opacity: 1; transform: none; }

.editorial-menu__preview {
  position: relative;
  aspect-ratio: 3 / 4;
  max-height: min(62vh, 650px);
  overflow: hidden;
  background: var(--surface-muted);
}
.editorial-menu__preview::after { content: ''; position: absolute; inset: 0; border: 1px solid rgba(255,255,255,.28); pointer-events: none; }
.editorial-menu__preview img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.88) contrast(1.02); }
.editorial-menu__preview figcaption { position: absolute; right: 1rem; bottom: 1rem; padding: 0.45rem 0.7rem; color: #fff; background: rgba(28, 12, 5, 0.52); font-family: system-ui, sans-serif; font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; backdrop-filter: blur(8px); }

.editorial-menu__footer { padding-top: 1.25rem; border-top: 1px solid var(--border); }
.editorial-menu__socials { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.editorial-menu__socials a {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  color: var(--muted);
  text-decoration: none;
}
.editorial-menu__socials svg {
  width: 21px;
  height: 21px;
  transition: color 0.2s ease, transform 0.25s ease;
}
.editorial-menu__socials a:hover { color: var(--primary); }
.editorial-menu__socials a:hover svg { transform: translateY(-4px); }
.editorial-menu__social-label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.editorial-menu__preferences { display: flex; align-items: center; gap: 1.5rem; }
.editorial-menu__preferences label,
.editorial-menu__language { display: flex; align-items: center; gap: 0.65rem; }
.menu-trigger:focus-visible,
.editorial-menu a:focus-visible,
.editorial-menu button:focus-visible { outline: 2px solid var(--primary); outline-offset: 4px; }
html.menu-is-open,
html.menu-is-open body { overflow: hidden; }
.editorial-menu-enter-active,
.editorial-menu-leave-active { transition: opacity 0.35s ease; }
.editorial-menu-enter-active .editorial-menu__body,
.editorial-menu-leave-active .editorial-menu__body { transition: transform 0.45s cubic-bezier(.2,.8,.2,1), opacity 0.3s ease; }
.editorial-menu-enter-from,
.editorial-menu-leave-to { opacity: 0; }
.editorial-menu-enter-from .editorial-menu__body,
.editorial-menu-leave-to .editorial-menu__body { opacity: 0; transform: translateY(20px); }
.preview-image-enter-active,
.preview-image-leave-active { transition: opacity 0.2s ease, transform 0.3s ease; }
.preview-image-enter-from { opacity: 0; transform: scale(1.025); }
.preview-image-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .menu-trigger { width: 58px; height: 58px; padding: 3px; overflow: visible; background: transparent; border: 0; }
  .menu-trigger__mark { width: 52px; height: 52px; padding: 3px; background: var(--surface); border: 1px solid var(--border); }
  .menu-trigger__letter { display: none; }
  .menu-trigger__mark img { display: block; width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
  .menu-trigger__badge {
    position: absolute;
    right: -3px;
    bottom: -2px;
    display: grid;
    gap: 2px;
    width: 19px;
    height: 19px;
    place-content: center;
    padding: 0;
    background: var(--primary);
    border: 1.5px solid var(--surface);
    border-radius: 50%;
  }
  .menu-trigger__badge i { display: block; width: 8px; height: 1px; background: var(--on-primary); border-radius: 2px; }
  .menu-trigger__label,
  .menu-trigger__lines { display: none; }
  .editorial-menu {
    grid-template-rows: auto minmax(0, 1fr) auto;
    padding: max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom));
  }
  .editorial-menu__header { padding-bottom: 0.75rem; }
  .editorial-menu__brand span { font-size: 1rem; }
  .editorial-menu__brand small,
  .editorial-menu__preview { display: none; }
  .editorial-menu__body { display: block; width: 100%; padding: 0.7rem 0; }
  .editorial-menu__links { gap: 0.25rem; }
  .editorial-menu__links a {
    grid-template-columns: 48px minmax(0, 1fr) auto;
    grid-template-rows: auto auto;
    column-gap: 0.8rem;
    padding: 0.4rem;
    border: 1px solid transparent;
    border-radius: 10px;
  }
  .editorial-menu__links a.router-link-active { background: var(--surface-muted); border-color: var(--border); }
  .editorial-menu__link-image {
    display: block;
    grid-column: 1;
    grid-row: 1 / 3;
    width: 48px;
    height: 56px;
    object-fit: cover;
    border-radius: 8px;
  }
  .editorial-menu__links small { grid-column: 2; grid-row: 1; align-self: end; font-size: 0.56rem; }
  .editorial-menu__links span { grid-column: 2; grid-row: 2; align-self: start; font-size: clamp(1.2rem, 5.8vw, 1.65rem); line-height: 1; letter-spacing: -0.02em; }
  .editorial-menu__links i { grid-column: 3; grid-row: 1 / 3; align-self: center; opacity: 0.55; transform: none; }
  .editorial-menu__footer { align-items: flex-start; padding-top: 0.75rem; gap: 1rem; }
  .editorial-menu__socials { gap: 0.35rem; }
  .editorial-menu__socials a { width: 42px; height: 42px; }
  .editorial-menu__socials svg { width: 23px; height: 23px; }
  .editorial-menu__preferences { align-items: flex-end; flex-direction: column; gap: 0.55rem; }
}

@media (max-width: 520px) {
  .editorial-menu__footer { flex-direction: column; }
  .editorial-menu__preferences { align-items: flex-start; flex-direction: row; flex-wrap: wrap; }
}

@media (max-height: 700px) and (max-width: 768px) {
  .editorial-menu__link-image { width: 42px; height: 44px; }
  .editorial-menu__links a { grid-template-columns: 42px minmax(0, 1fr) auto; padding-top: 0.25rem; padding-bottom: 0.25rem; }
  .editorial-menu__links span { font-size: 1.15rem; }
  .editorial-menu__footer { font-size: 0.58rem; }
}

@media (max-height: 760px) and (min-width: 769px) {
  .editorial-menu__body { padding: 1.25rem 0; }
  .editorial-menu__links span { font-size: clamp(1.8rem, 4.2vw, 3.5rem); }
  .editorial-menu__preview { max-height: 54vh; }
}

@media (prefers-reduced-motion: reduce) {
  .editorial-menu__socials svg { transition: none; }
  .editorial-menu__socials a:hover svg { transform: none; }
  .editorial-menu-enter-active,
  .editorial-menu-leave-active,
  .editorial-menu-enter-active .editorial-menu__body,
  .editorial-menu-leave-active .editorial-menu__body,
  .preview-image-enter-active,
  .preview-image-leave-active,
  .editorial-menu__links span { transition: none; }
}
</style>
