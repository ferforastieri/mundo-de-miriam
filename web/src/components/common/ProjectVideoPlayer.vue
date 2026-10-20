<template>
  <div class="project-player">
    <video
      ref="videoEl"
      :src="src"
      playsinline
      preload="metadata"
      @click="toggle"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onMetadata"
      @ended="playing = false"
    ></video>

    <button
      v-if="!playing"
      class="project-player__overlay"
      type="button"
      aria-label="Reproduzir vídeo"
      @click="toggle"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
    </button>

    <div class="project-player__controls">
      <button type="button" :aria-label="playing ? 'Pausar' : 'Reproduzir'" @click="toggle">
        <svg v-if="playing" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      <input
        class="project-player__seek"
        type="range"
        min="0"
        :max="duration || 0"
        step="0.1"
        :value="currentTime"
        :style="{ '--progress': `${progressPercent}%` }"
        aria-label="Progresso do vídeo"
        @input="onSeek"
      />

      <span class="project-player__time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>

      <button type="button" :aria-label="muted ? 'Ativar som' : 'Silenciar'" @click="toggleMute">
        <svg v-if="muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
          <path d="m16 9 5 6M21 9l-5 6" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" />
        </svg>
      </button>

      <button type="button" aria-label="Tela cheia" @click="toggleFullscreen">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  src: { type: String, required: true }
})

const videoEl = ref(null)
const playing = ref(false)
const muted = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return Math.min(100, Math.max(0, (currentTime.value / duration.value) * 100))
})

function toggle() {
  const video = videoEl.value

  if (!video) return

  if (video.paused) {
    video.play().then(() => {
      playing.value = true
    }).catch(() => {})
  } else {
    video.pause()
    playing.value = false
  }
}

function onTimeUpdate() {
  currentTime.value = videoEl.value?.currentTime || 0
}

function onMetadata() {
  duration.value = videoEl.value?.duration || 0
  muted.value = Boolean(videoEl.value?.muted)
}

function onSeek(event) {
  const time = Number(event.target.value)

  if (!videoEl.value || !Number.isFinite(time)) return

  videoEl.value.currentTime = time
  currentTime.value = time
}

function toggleMute() {
  const video = videoEl.value

  if (!video) return

  video.muted = !video.muted
  muted.value = video.muted
}

function toggleFullscreen() {
  const player = videoEl.value?.parentElement

  if (!player) return

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {})
    return
  }

  player.requestFullscreen?.().catch(() => {})
}

function formatTime(value) {
  const total = Math.max(0, Math.floor(Number(value) || 0))
  const minutes = Math.floor(total / 60)
  const seconds = String(total % 60).padStart(2, '0')

  return `${minutes}:${seconds}`
}
</script>

<style scoped>
.project-player {
  position: relative;
  display: inline-grid;
  max-width: min(1100px, 94vw);
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  color: #f8f2ec;
}

.project-player video {
  display: block;
  width: 100%;
  max-height: min(76vh, calc(100vh - 140px));
  object-fit: contain;
  background: #000;
  cursor: pointer;
}

.project-player__overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border: 0;
  border-radius: 50%;
  background: rgba(248, 242, 236, 0.92);
  color: #552200;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.project-player__overlay:hover {
  background: #f8f2ec;
  transform: translate(-50%, -50%) scale(1.05);
}

.project-player__overlay svg {
  width: 30px;
  height: 30px;
  margin-left: 3px;
}

.project-player__controls {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.6rem;
  background: linear-gradient(transparent, rgba(24, 14, 9, 0.9));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.project-player:hover .project-player__controls,
.project-player:focus-within .project-player__controls {
  opacity: 1;
}

@media (hover: none) {
  .project-player__controls {
    opacity: 1;
  }
}

.project-player__controls button {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.project-player__controls button:hover {
  background: rgba(248, 242, 236, 0.16);
}

.project-player__controls svg {
  width: 18px;
  height: 18px;
}

.project-player__seek {
  flex: 1;
  min-width: 60px;
  height: 18px;
  margin: 0;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
}

.project-player__seek::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    #d8b28c 0,
    #d8b28c var(--progress, 0%),
    rgba(248, 242, 236, 0.35) var(--progress, 0%),
    rgba(248, 242, 236, 0.35) 100%
  );
}

.project-player__seek::-webkit-slider-thumb {
  width: 13px;
  height: 13px;
  margin-top: -4.5px;
  border: 0;
  border-radius: 50%;
  background: #f8f2ec;
  -webkit-appearance: none;
}

.project-player__seek::-moz-range-track {
  height: 4px;
  border-radius: 999px;
  background: rgba(248, 242, 236, 0.35);
}

.project-player__seek::-moz-range-progress {
  height: 4px;
  border-radius: 999px;
  background: #d8b28c;
}

.project-player__seek::-moz-range-thumb {
  width: 13px;
  height: 13px;
  border: 0;
  border-radius: 50%;
  background: #f8f2ec;
}

.project-player__time {
  flex: 0 0 auto;
  color: #f8f2ec;
  font-family: system-ui, sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.03em;
  white-space: nowrap;
}
</style>
