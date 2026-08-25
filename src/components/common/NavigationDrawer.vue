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
        :class="{ 'editorial-menu--dragging': isDraggingSheet }"
        :style="mobileSheetStyle"
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        tabindex="-1"
        @keydown="handleDialogKeydown"
        @click.self="closeFromBackdrop"
      >
        <div
          ref="mobileSheet"
          class="editorial-menu__sheet"
          @touchstart="startCloseGesture"
          @touchmove="moveCloseGesture"
          @touchend="endCloseGesture"
          @touchcancel="cancelCloseGesture"
        >
        <span class="editorial-menu__sheet-handle" aria-hidden="true"></span>
        <header
          class="editorial-menu__header"
        >
          <RouterLink to="/" class="editorial-menu__brand" @click="close">
            <span>Mundo de Miriam</span>
            <small>Maquiagem · Fotografia · Beleza</small>
          </RouterLink>
          <button ref="closeButton" class="editorial-menu__close" type="button" aria-label="Fechar menu" @click="close">
            <span>Fechar</span><i aria-hidden="true"></i>
          </button>
        </header>

        <div ref="menuBody" class="editorial-menu__body">
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
              class="editorial-menu__conversation"
              href="https://wa.me/5515991962479"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vamos conversar pelo WhatsApp"
              @click="close"
            >
              <span>Vamos conversar</span>
              <i aria-hidden="true">→</i>
            </a>
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
          <button
            ref="mobileCloseButton"
            class="editorial-menu__mobile-close"
            type="button"
            aria-label="Fechar menu"
            @click="close"
          >
            <span class="editorial-menu__mobile-close-mark" aria-hidden="true">
              <img src="/apple-touch-icon.png" alt="" />
              <span class="editorial-menu__mobile-close-badge"><i></i><i></i></span>
            </span>
          </button>
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
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
const mobileCloseButton = ref(null)
const menuDialog = ref(null)
const mobileSheet = ref(null)
const menuBody = ref(null)
const isDraggingSheet = ref(false)
const sheetOffset = ref(0)
const sheetProgress = ref(1)
const SWIPE_THRESHOLD = 52
const SWIPE_AXIS_RATIO = 1.2
let dockElement = null

const openGesture = { active: false, recognized: false, startX: 0, startY: 0, currentX: 0, currentY: 0, startTime: 0 }
const closeGesture = { active: false, recognized: false, eligible: false, startX: 0, startY: 0, currentX: 0, currentY: 0, startTime: 0 }

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
const isMobileViewport = () => window.matchMedia('(max-width: 768px)').matches
const getSheetHeight = () => Math.min(window.innerHeight * 0.92, 760)
const mobileSheetStyle = computed(() => ({
  '--mobile-sheet-offset': `${sheetOffset.value}px`,
  '--mobile-sheet-progress': sheetProgress.value
}))

const setSheetPosition = (offset) => {
  const height = getSheetHeight()
  const nextOffset = Math.max(0, Math.min(height, offset))
  sheetOffset.value = nextOffset
  sheetProgress.value = Math.max(0, Math.min(1, 1 - nextOffset / height))
}

const focusMobileClose = () => {
  window.setTimeout(() => mobileCloseButton.value?.focus({ preventScroll: true }), 320)
}

const open = async () => {
  activePath.value = route.path
  isDraggingSheet.value = false
  setSheetPosition(0)
  isOpen.value = true
  await nextTick()
  const focusTarget = isMobileViewport() ? mobileCloseButton.value : closeButton.value
  focusTarget?.focus()
}

const close = () => {
  isDraggingSheet.value = false
  isOpen.value = false
  setSheetPosition(0)
  nextTick(() => triggerButton.value?.focus())
}

const closeFromBackdrop = () => {
  if (isMobileViewport()) close()
}

const settleSheet = (openSheet) => {
  isDraggingSheet.value = false

  if (openSheet) {
    setSheetPosition(0)
    focusMobileClose()
    return
  }

  isOpen.value = false
  nextTick(() => {
    setSheetPosition(0)
    triggerButton.value?.focus()
  })
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

const resetGesture = (gesture) => {
  gesture.active = false
  gesture.recognized = false
}

const startOpenGesture = (event) => {
  if (isOpen.value || !isMobileViewport() || event.touches.length !== 1) return
  const touch = event.touches[0]
  Object.assign(openGesture, {
    active: true,
    recognized: false,
    startX: touch.clientX,
    startY: touch.clientY,
    currentX: touch.clientX,
    currentY: touch.clientY,
    startTime: performance.now()
  })
}

const moveOpenGesture = (event) => {
  if (!openGesture.active || event.touches.length !== 1) return
  const touch = event.touches[0]
  openGesture.currentX = touch.clientX
  openGesture.currentY = touch.clientY
  const deltaX = touch.clientX - openGesture.startX
  const deltaY = touch.clientY - openGesture.startY

  if (deltaY < -10 && Math.abs(deltaY) > Math.abs(deltaX) * SWIPE_AXIS_RATIO) {
    if (!openGesture.recognized) {
      openGesture.recognized = true
      activePath.value = route.path
      isDraggingSheet.value = true
      setSheetPosition(getSheetHeight())
      isOpen.value = true
    }
    setSheetPosition(getSheetHeight() + deltaY)
    event.preventDefault()
  }
}

const endOpenGesture = (event) => {
  if (!openGesture.active) return
  const distance = openGesture.startY - openGesture.currentY
  const elapsed = Math.max(1, performance.now() - openGesture.startTime)
  const velocity = distance / elapsed
  const shouldOpen = openGesture.recognized && (sheetProgress.value >= 0.24 || distance >= SWIPE_THRESHOLD || velocity >= 0.45)
  const wasRecognized = openGesture.recognized
  resetGesture(openGesture)

  if (wasRecognized) {
    event.preventDefault()
    settleSheet(shouldOpen)
  }
}

const startCloseGesture = (event) => {
  if (!isMobileViewport() || event.touches.length !== 1) return
  const touch = event.touches[0]
  Object.assign(closeGesture, {
    active: true,
    recognized: false,
    eligible: (menuBody.value?.scrollTop || 0) <= 1,
    startX: touch.clientX,
    startY: touch.clientY,
    currentX: touch.clientX,
    currentY: touch.clientY,
    startTime: performance.now()
  })
}

const moveCloseGesture = (event) => {
  if (!closeGesture.active || event.touches.length !== 1) return
  const touch = event.touches[0]
  closeGesture.currentX = touch.clientX
  closeGesture.currentY = touch.clientY
  const deltaX = touch.clientX - closeGesture.startX
  const deltaY = touch.clientY - closeGesture.startY

  if (closeGesture.eligible && deltaY > 10 && deltaY > Math.abs(deltaX) * SWIPE_AXIS_RATIO) {
    closeGesture.recognized = true
    isDraggingSheet.value = true
    setSheetPosition(deltaY)
    event.preventDefault()
  }
}

const endCloseGesture = (event) => {
  if (!closeGesture.active) return
  const distance = closeGesture.currentY - closeGesture.startY
  const elapsed = Math.max(1, performance.now() - closeGesture.startTime)
  const velocity = distance / elapsed
  const shouldClose = closeGesture.recognized && (sheetProgress.value <= 0.76 || distance >= SWIPE_THRESHOLD || velocity >= 0.45)
  const wasRecognized = closeGesture.recognized
  resetGesture(closeGesture)

  if (wasRecognized) {
    event.preventDefault()
    settleSheet(!shouldClose)
  }
}

const cancelCloseGesture = () => {
  const wasRecognized = closeGesture.recognized
  resetGesture(closeGesture)
  if (wasRecognized) settleSheet(true)
}
const resetOpenGesture = () => {
  const wasRecognized = openGesture.recognized
  resetGesture(openGesture)
  if (wasRecognized) settleSheet(false)
}

onMounted(() => {
  dockElement = triggerButton.value?.closest('.site-dock')
  dockElement?.addEventListener('touchstart', startOpenGesture, { passive: true })
  dockElement?.addEventListener('touchmove', moveOpenGesture, { passive: false })
  dockElement?.addEventListener('touchend', endOpenGesture, { passive: false })
  dockElement?.addEventListener('touchcancel', resetOpenGesture, { passive: true })
})

watch(isOpen, (open) => {
  document.documentElement.classList.toggle('menu-is-open', open)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('menu-is-open')
  dockElement?.removeEventListener('touchstart', startOpenGesture)
  dockElement?.removeEventListener('touchmove', moveOpenGesture)
  dockElement?.removeEventListener('touchend', endOpenGesture)
  dockElement?.removeEventListener('touchcancel', resetOpenGesture)
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
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
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

.editorial-menu__sheet { display: contents; }
.editorial-menu__sheet-handle { display: none; }

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
.editorial-menu__socials a.editorial-menu__conversation { display: none; }
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
.editorial-menu__mobile-close { display: none; }
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
  .menu-trigger {
    flex: 0 0 50px;
    width: 50px;
    height: 50px;
    padding: 1px;
    overflow: visible;
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }
  .menu-trigger:hover { box-shadow: none; }
  .menu-trigger__mark { width: 48px; height: 48px; padding: 2px; background: var(--surface); border: 0; }
  .menu-trigger__letter { display: none; }
  .menu-trigger__mark img { display: block; width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
  .menu-trigger__badge {
    position: absolute;
    right: -3px;
    bottom: -2px;
    display: grid;
    gap: 2px;
    width: 18px;
    height: 18px;
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
    display: block;
    min-height: 100dvh;
    padding: 0;
    overflow: hidden;
    background: rgb(20 11 7 / calc(var(--mobile-sheet-progress) * 0.46));
    backdrop-filter: none;
    transition: background-color 0.32s ease;
  }
  .editorial-menu__sheet {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    width: 100%;
    height: min(92dvh, 760px);
    max-height: calc(100dvh - 10px);
    padding: 22px 14px max(14px, env(safe-area-inset-bottom));
    overflow: hidden;
    color: var(--text);
    background: var(--surface);
    border: 1px solid var(--border);
    border-bottom: 0;
    border-radius: 22px 22px 0 0;
    box-shadow: 0 -18px 55px rgb(24 10 4 / 0.2);
    transform: translate3d(0, var(--mobile-sheet-offset), 0);
    transition: transform 0.32s cubic-bezier(.22, .8, .25, 1);
    will-change: transform;
  }
  .editorial-menu__sheet-handle {
    position: absolute;
    top: 8px;
    left: 50%;
    display: block;
    width: 38px;
    height: 4px;
    background: var(--border);
    border-radius: 999px;
    transform: translateX(-50%);
  }
  .editorial-menu--dragging,
  .editorial-menu--dragging.editorial-menu-enter-from { opacity: 1; }
  .editorial-menu--dragging .editorial-menu__sheet {
    transform: translate3d(0, var(--mobile-sheet-offset), 0);
    transition: none;
  }
  .editorial-menu__header { padding-bottom: 0.75rem; }
  .editorial-menu__brand span { font-size: 1rem; }
  .editorial-menu__brand small,
  .editorial-menu__preview { display: none; }
  .editorial-menu__body {
    display: block;
    width: 100%;
    min-height: 0;
    padding: 0.7rem 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }
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
  .editorial-menu__footer {
    display: grid;
    grid-template-columns: 58px minmax(0, 1fr);
    grid-template-rows: auto 60px;
    align-items: center;
    padding-top: 0.75rem;
    padding-bottom: 0;
    column-gap: 0.75rem;
    row-gap: 0.65rem;
  }
  .editorial-menu__socials {
    grid-column: 1 / -1;
    grid-row: 1;
    gap: 0.35rem;
  }
  .editorial-menu__socials a { width: 42px; height: 42px; }
  .editorial-menu__socials svg { width: 23px; height: 23px; }
  .editorial-menu__socials a.editorial-menu__conversation {
    --drawer-contact-pulse: rgb(111 47 24 / 0.13);
    display: inline-flex;
    width: auto;
    height: 42px;
    align-items: center;
    gap: 0.3rem;
    padding: 0.45rem 0.55rem;
    color: var(--muted);
    background-color: var(--surface-muted);
    background-image: linear-gradient(105deg, transparent 28%, var(--drawer-contact-pulse) 48%, transparent 68%);
    background-position: 125% 0;
    background-size: 280% 100%;
    border: 1px solid var(--border);
    border-radius: 10px;
    font-family: system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 650;
    letter-spacing: 0.025em;
    white-space: nowrap;
  }
  .editorial-menu__conversation i {
    color: #6f2f18;
    font-size: 0.92rem;
    font-style: normal;
    line-height: 1;
  }
  html[data-theme="dark"] .editorial-menu__conversation {
    --drawer-contact-pulse: rgb(225 161 127 / 0.17);
  }
  html[data-theme="dark"] .editorial-menu__conversation i { color: #e1a17f; }
  .editorial-menu__preferences {
    grid-column: 2;
    grid-row: 2;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
    width: 100%;
    gap: 0.5rem;
  }
  .editorial-menu__preferences label,
  .editorial-menu__language {
    display: block;
    min-width: 0;
  }
  .editorial-menu__preferences > label > span,
  .editorial-menu__language > span { display: none; }
  .editorial-menu__preferences :deep(.styled-select),
  .editorial-menu__preferences :deep(.language-switcher--drawer) {
    width: 100%;
    min-width: 0;
  }
  .editorial-menu__preferences :deep(.styled-select__trigger) {
    min-width: 0;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }
  .editorial-menu__preferences :deep(.styled-select__trigger span) {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .editorial-menu__preferences > label :deep(.styled-select__menu) {
    right: auto;
    left: 0;
  }
  .editorial-menu__mobile-close {
    position: static;
    grid-column: 1;
    grid-row: 2;
    align-self: center;
    justify-self: start;
    z-index: 2;
    display: grid;
    width: 58px;
    height: 58px;
    padding: 3px;
    place-items: center;
    color: var(--primary);
    background: transparent;
    border: 0;
    cursor: pointer;
  }
  .editorial-menu__mobile-close-mark {
    position: relative;
    display: grid;
    width: 50px;
    height: 50px;
    padding: 3px;
    place-items: center;
    background: var(--surface);
    border-radius: 50%;
  }
  .editorial-menu__mobile-close-mark img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
  .editorial-menu__mobile-close-badge {
    position: absolute;
    right: -3px;
    bottom: -2px;
    width: 19px;
    height: 19px;
    background: var(--primary);
    border: 1.5px solid var(--surface);
    border-radius: 50%;
  }
  .editorial-menu__mobile-close-badge i {
    position: absolute;
    top: 8px;
    left: 4px;
    width: 9px;
    height: 1px;
    background: var(--on-primary);
    transform: rotate(45deg);
  }
  .editorial-menu__mobile-close-badge i:last-child { transform: rotate(-45deg); }

  .editorial-menu-enter-active,
  .editorial-menu-leave-active {
    transition: background-color 0.32s ease, opacity 0.32s ease;
  }
  .editorial-menu-enter-active .editorial-menu__sheet,
  .editorial-menu-leave-active .editorial-menu__sheet {
    transition: transform 0.32s cubic-bezier(.22, .8, .25, 1);
  }
  .editorial-menu-enter-from,
  .editorial-menu-leave-to {
    opacity: 1;
    background: rgb(20 11 7 / 0);
  }
  .editorial-menu-enter-from .editorial-menu__sheet,
  .editorial-menu-leave-to .editorial-menu__sheet {
    transform: translate3d(0, 100%, 0);
  }
  .editorial-menu-enter-from .editorial-menu__body,
  .editorial-menu-leave-to .editorial-menu__body {
    opacity: 1;
    transform: none;
  }
  .editorial-menu--dragging.editorial-menu-enter-active,
  .editorial-menu--dragging.editorial-menu-leave-active { transition: none; }
  .editorial-menu--dragging.editorial-menu-enter-from,
  .editorial-menu--dragging.editorial-menu-leave-to {
    background: rgb(20 11 7 / calc(var(--mobile-sheet-progress) * 0.46));
  }
  .editorial-menu--dragging.editorial-menu-enter-from .editorial-menu__sheet,
  .editorial-menu--dragging.editorial-menu-leave-to .editorial-menu__sheet {
    transform: translate3d(0, var(--mobile-sheet-offset), 0);
  }
}

@media (max-width: 768px) and (prefers-reduced-motion: no-preference) {
  .editorial-menu__conversation { animation: drawer-contact-pulse 2.2s linear infinite; }

  @keyframes drawer-contact-pulse {
    from { background-position: 125% 0; }
    to { background-position: -35% 0; }
  }
}

@media (max-width: 520px) {
  .editorial-menu__preferences { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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

  .editorial-menu,
  .editorial-menu__sheet { transition-duration: 0.01ms !important; }
}
</style>
