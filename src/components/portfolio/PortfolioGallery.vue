<template>
  <div class="portfolio-gallery">
    <div 
      v-for="(image, index) in images" 
      :key="index"
      class="gallery-item"
      @click="openModal(index)"
    >
      <img 
        :src="image.src" 
        :alt="image.alt"
        loading="lazy"
      />
      <div class="gallery-overlay">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15 3v4H5v10h14V9h4V3h-8zM3 21h18v-2H3v2zM9 9h6v2H9V9zm0 4h6v2H9v-2z"/>
        </svg>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        <div class="modal-image-container">
          <img :src="currentImage.src" :alt="currentImage.alt" />
        </div>
        
        <div class="modal-navigation">
          <button @click="previousImage" class="nav-button prev" :disabled="currentIndex === 0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <span class="image-counter">{{ currentIndex + 1 }} / {{ images.length }}</span>
          
          <button @click="nextImage" class="nav-button next" :disabled="currentIndex === images.length - 1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortfolioGallery',
  props: {
    images: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      modalOpen: false,
      currentIndex: 0
    }
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex] || {}
    }
  },
  methods: {
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
      if (this.currentIndex < this.images.length - 1) {
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  aspect-ratio: 1;
}

.gallery-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
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
  max-height: 80vh;
  overflow: hidden;
}

.modal-image-container img {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
}

.modal-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  background: #f8f9fa;
}

.nav-button {
  background: #520;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover:not(:disabled) {
  background: #333;
  transform: scale(1.1);
}

.nav-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.image-counter {
  font-family: 'Gilda Display', serif;
  color: #520;
  font-weight: bold;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .portfolio-gallery {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .modal {
    padding: 1rem;
  }
  
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
