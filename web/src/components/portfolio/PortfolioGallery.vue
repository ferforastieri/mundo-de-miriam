<template>
  <div class="portfolio-gallery">
    <div 
      v-for="(image, index) in visibleImages"
      :key="image.id || index"
      class="gallery-item"
      @click="openModal(index)"
    >
      <video
        v-if="isVideo(image)"
        :src="image.src"
        muted
        playsinline
        preload="metadata"
      ></video>
      <img
        v-else
        :src="image.src"
        :alt="image.alt"
        loading="lazy"
      />
      <span v-if="isVideo(image)" class="video-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </span>

      <button
        v-if="downloadable"
        class="gallery-download"
        type="button"
        aria-label="Baixar arquivo"
        title="Baixar arquivo"
        @click.stop.prevent="download(image)"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="gallery-overlay">
        <svg v-if="isVideo(image)" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15 3v4H5v10h14V9h4V3h-8zM3 21h18v-2H3v2zM9 9h6v2H9V9zm0 4h6v2H9v-2z"/>
        </svg>
      </div>
    </div>

    <MediaLightbox
      :open="modalOpen"
      :src="currentImage.src || ''"
      :type="currentImage.type || ''"
      :alt="currentImage.alt || ''"
      :counter="`${currentIndex + 1} / ${visibleImages.length}`"
      :has-prev="currentIndex > 0"
      :has-next="currentIndex < visibleImages.length - 1"
      :downloadable="downloadable"
      @close="closeModal"
      @prev="previousImage"
      @next="nextImage"
      @download="download(currentImage)"
    />
  </div>
</template>

<script>
import MediaLightbox from '@/components/common/MediaLightbox.vue'

export default {
  name: 'PortfolioGallery',
  props: {
    images: {
      type: Array,
      required: true,
      default: () => []
    },
    downloadable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalOpen: false,
      currentIndex: 0
    }
  },
  computed: {
    visibleImages() {
      return this.images
    },
    currentImage() {
      return this.visibleImages[this.currentIndex] || {}
    }
  },
  methods: {
    isVideo(image) {
      return String(image?.type || '').startsWith('video/')
    },
    download(image) {
      if (!image?.src) return

      const url = new URL(image.src, window.location.origin)
      url.searchParams.set('download', '1')

      const link = document.createElement('a')
      link.href = url.toString()
      link.download = image.alt || 'arquivo'
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    openModal(index) {
      this.currentIndex = index
      this.modalOpen = true
      document.body.style.overflow = 'hidden'
    },
    closeModal() {
      this.modalOpen = false
      document.body.style.overflow = 'auto'
    },
    nextImage() {
      if (this.currentIndex < this.visibleImages.length - 1) {
        this.currentIndex++
      }
    },
    previousImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    }
  },
  beforeUnmount() {
    document.body.style.overflow = 'auto'
  }
}
</script>

<style scoped>
.portfolio-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.gallery-item {
  -webkit-tap-highlight-color: transparent;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: var(--skeleton-base);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  aspect-ratio: 1;
}

.gallery-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.video-badge {
  position: absolute;
  top: 0.7rem;
  left: 0.7rem;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(24, 14, 9, 0.55);
  color: #fff;
  backdrop-filter: blur(2px);
}

.video-badge svg {
  width: 18px;
  height: 18px;
}

.gallery-download {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  outline: none;
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 10px;
  background: rgba(24, 14, 9, 0.55);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(2px);
}

@media (hover: hover) {
  .gallery-download:hover {
    background: rgba(24, 14, 9, 0.8);
  }
}

.gallery-download:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.gallery-download svg {
  width: 18px;
  height: 18px;
}

.gallery-item img,
.gallery-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(82, 32, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

@media (hover: hover) {
  .gallery-item:hover .gallery-overlay {
    opacity: 1;
  }
}

@media (hover: none) {
  .gallery-item .gallery-overlay {
    display: none;
  }
}

.modal {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.9);
  display: grid;
  place-items: center;
  z-index: 20000;
  padding: 1rem;
}

.modal-content {
  position: relative;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  width: min(1100px, calc(100vw - 2rem));
  height: min(900px, calc(100dvh - 2rem));
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  z-index: 1001;
  transition: background 0.3s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.8);
}

.modal-image-container {
  display: grid;
  min-width: 0;
  min-height: 0;
  place-items: center;
  overflow: hidden;
  background: #0d0d0d;
}

.modal-image-container img,
.modal-image-container video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.modal-image-container video {
  background: #000;
}

.modal-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  background: var(--surface-muted);
  border-top: 1px solid var(--border);
}

.nav-button {
  background: var(--primary);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover:not(:disabled) {
  background: var(--text);
  color: var(--surface);
  transform: scale(1.1);
}

.nav-button:disabled {
  background: var(--border);
  color: var(--muted);
  cursor: not-allowed;
}

.image-counter {
  font-family: 'Gilda Display', serif;
  color: var(--primary);
  font-weight: bold;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .portfolio-gallery {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .modal {
    padding: 0.5rem;
  }

  .modal-content { width: calc(100vw - 1rem); height: calc(100dvh - 1rem); }
  
  .modal-navigation {
    gap: 1rem;
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .portfolio-gallery {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
