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
          <span>{{ counter }}</span>
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
import { computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  src: { type: String, default: '' },
  type: { type: String, default: '' },
  alt: { type: String, default: '' },
  counter: { type: String, default: '' },
  hasPrev: { type: Boolean, default: false },
  hasNext: { type: Boolean, default: false }
})

defineEmits(['close', 'prev', 'next'])

const isVideo = computed(() => String(props.type || '').startsWith('video/'))
</script>

<style>
.media-lightbox {
  position: fixed;
  inset: 0;
  z-index: 4000;
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
  max-height: 78vh;
  border-radius: 12px;
  object-fit: contain;
  background: #000;
}

.media-lightbox__close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 4001;
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

.media-lightbox-enter-active,
.media-lightbox-leave-active {
  transition: opacity 0.18s ease;
}

.media-lightbox-enter-from,
.media-lightbox-leave-to {
  opacity: 0;
}
</style>
