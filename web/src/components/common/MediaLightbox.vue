<template>
  <Teleport to="body">
    <Transition name="media-lightbox">
      <div v-if="open" class="media-lightbox" @click.self="$emit('close')">
        <button class="media-lightbox__close" type="button" aria-label="Fechar" @click="$emit('close')">
          ×
        </button>

        <div class="media-lightbox__stage">
          <video v-if="isVideo" :src="src" controls autoplay playsinline></video>
          <img v-else :src="src" :alt="alt" />
        </div>

        <div class="media-lightbox__bar">
          <button
            class="media-lightbox__nav"
            type="button"
            :disabled="!hasPrev"
            aria-label="Anterior"
            @click="$emit('prev')"
          >
            ←
          </button>

          <span class="media-lightbox__counter">{{ counter }}</span>

          <button
            v-if="downloadable"
            class="media-lightbox__nav media-lightbox__download"
            type="button"
            aria-label="Baixar arquivo"
            title="Baixar arquivo"
            @click.prevent="$emit('download')"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <button
            class="media-lightbox__nav"
            type="button"
            :disabled="!hasNext"
            aria-label="Próxima"
            @click="$emit('next')"
          >
            →
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  src: { type: String, default: '' },
  type: { type: String, default: '' },
  alt: { type: String, default: '' },
  counter: { type: String, default: '' },
  hasPrev: { type: Boolean, default: false },
  hasNext: { type: Boolean, default: false },
  downloadable: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'prev', 'next', 'download'])

const isVideo = computed(() => String(props.type || '').startsWith('video/'))

function onKeydown(event) {
  if (!props.open) return

  if (event.key === 'Escape') emit('close')
  if (event.key === 'ArrowLeft' && props.hasPrev) emit('prev')
  if (event.key === 'ArrowRight' && props.hasNext) emit('next')
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style>
.media-lightbox {
  position: fixed;
  inset: 0;
  z-index: 12000;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 0.75rem;
  padding: 1.25rem;
  background: rgba(18, 10, 6, 0.94);
}

.media-lightbox__stage {
  display: grid;
  place-items: center;
  min-height: 0;
}

.media-lightbox__stage img,
.media-lightbox__stage video {
  max-width: min(1100px, 94vw);
  max-height: min(76vh, calc(100vh - 130px));
  border-radius: 12px;
  object-fit: contain;
  background: #000;
}

.media-lightbox__close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 12001;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

.media-lightbox__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #fff;
  font-family: system-ui, sans-serif;
  font-size: 0.85rem;
}

.media-lightbox__counter {
  min-width: 72px;
  text-align: center;
}

.media-lightbox__nav {
  display: grid;
  place-items: center;
  min-width: 38px;
  height: 38px;
  padding: 0 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  background: transparent;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.media-lightbox__nav:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.media-lightbox__download svg {
  width: 18px;
  height: 18px;
}

.media-lightbox-enter-active,
.media-lightbox-leave-active {
  transition: opacity 0.18s ease;
}

.media-lightbox-enter-from,
.media-lightbox-leave-to {
  opacity: 0;
}
</style>
