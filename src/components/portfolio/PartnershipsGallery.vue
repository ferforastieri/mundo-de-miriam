<template>
  <div class="partnerships-gallery">
    <div 
      v-for="(partnership, index) in partnerships" 
      :key="index"
      class="partnership-card"
      :class="{ 'expanded': partnership.isExpanded }"
      @click="togglePartnership(index)"
    >
      <!-- Card Header -->
      <div class="card-header">
        <div class="main-image">
          <img 
            :src="partnership.mainImage" 
            :alt="partnership.name"
            loading="lazy"
          />
          <div class="image-overlay">
            <h3 class="partnership-name">{{ partnership.name }}</h3>
            <p class="partnership-count">{{ partnership.images.length }} fotos</p>
          </div>
        </div>
      </div>

      <!-- Expanded Content -->
      <div v-if="partnership.isExpanded" class="expanded-content" @click.stop>
        <div class="gallery-grid">
          <div 
            v-for="(image, imgIndex) in partnership.images" 
            :key="imgIndex"
            class="gallery-item"
            @click="openModal(partnership.images, imgIndex)"
          >
            <img 
              :src="image.src" 
              :alt="image.alt"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <!-- Expand/Collapse Indicator -->
      <div class="expand-indicator">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotated': partnership.isExpanded }">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
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
          
          <span class="image-counter">{{ currentIndex + 1 }} / {{ currentImages.length }}</span>
          
          <button @click="nextImage" class="nav-button next" :disabled="currentIndex === currentImages.length - 1">
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
  name: 'PartnershipsGallery',
  props: {
    partnerships: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      modalOpen: false,
      currentIndex: 0,
      currentImages: []
    }
  },
  computed: {
    currentImage() {
      return this.currentImages[this.currentIndex] || {}
    }
  },
  methods: {
    togglePartnership(index) {
      this.$emit('toggle-partnership', index)
    },
    openModal(images, index) {
      this.currentImages = images
      this.currentIndex = index
      this.modalOpen = true
      document.body.style.overflow = 'hidden'
    },
    closeModal() {
      this.modalOpen = false
      document.body.style.overflow = 'auto'
    },
    nextImage() {
      if (this.currentIndex < this.currentImages.length - 1) {
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
.partnerships-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.partnership-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.partnership-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.card-header {
  position: relative;
}

.main-image {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.partnership-card:hover .main-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 2rem 1.5rem 1.5rem;
  color: white;
}

.partnership-name {
  font-family: 'Gilda Display', serif;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: normal;
  letter-spacing: 1px;
}

.partnership-count {
  font-family: 'Gilda Display', serif;
  font-size: 1rem;
  margin: 0;
  opacity: 0.8;
  font-style: italic;
}

.expand-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #520;
  transition: all 0.3s ease;
}

.expand-indicator svg {
  transition: transform 0.3s ease;
}

.expand-indicator svg.rotated {
  transform: rotate(180deg);
}

.expanded-content {
  padding: 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.gallery-item {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  .partnerships-gallery {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.75rem;
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
  .partnerships-gallery {
    gap: 1rem;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  }
}
</style>
