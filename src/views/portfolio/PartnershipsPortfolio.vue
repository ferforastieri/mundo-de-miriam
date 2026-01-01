<template>
  <PartnershipsLayout>
    <div class="portfolio-container">
      <!-- Header Section -->
      <div class="portfolio-header">
        <button @click="goBack" class="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          <span><TranslatableText text="Voltar" /></span>
        </button>
        
        <div class="header-content">
          <h1 class="portfolio-title">
            <TranslatableText text="Parcerias" />
          </h1>
          <p class="portfolio-subtitle">
            <TranslatableText text="Colaborações e trabalhos em conjunto" />
          </p>
        </div>
      </div>

      <!-- Partnerships Gallery -->
      <div v-if="partnerships.length === 0" class="loading">
        <TranslatableText text="Carregando parcerias..." />
      </div>
      <PartnershipsGallery 
        v-else 
        :partnerships="partnerships" 
        @toggle-partnership="togglePartnership"
      />
    </div>
  </PartnershipsLayout>
</template>

<script>
import { useRouter } from 'vue-router'
import PartnershipsLayout from '@/layouts/portfolio/PartnershipsLayout.vue'
import { TranslatableText } from '@/components/common'
import { PartnershipsGallery } from '@/components/portfolio'

export default {
  name: 'PartnershipsPortfolio',
  components: {
    PartnershipsLayout,
    TranslatableText,
    PartnershipsGallery
  },
  setup() {
    const router = useRouter()
    
    const goBack = () => {
      router.push('/')
    }
    
    return {
      goBack
    }
  },
  data() {
    return {
      partnerships: []
    }
  },
  mounted() {
    this.loadPartnerships()
  },
  methods: {
    async loadPartnerships() {
      const partnershipsData = [
        {
          name: 'Fresh Lady',
          folder: 'freshlady',
          count: 7
        },
        {
          name: 'Icoice',
          folder: 'icoice',
          count: 4
        },
        {
          name: 'TTD Eye',
          folder: 'ttdeye',
          count: 12
        },
        {
          name: 'Unibling',
          folder: 'unibling',
          count: 4
        }
      ]

      try {
        const partnerships = []

        for (const partnership of partnershipsData) {
          const images = []
          
          for (let i = 1; i <= partnership.count; i++) {
            let fileName = `${partnership.folder}${i}`
            
            if (partnership.folder === 'freshlady') {
              fileName = `freashlady${i}`
            }
            
            images.push({
              src: `/assets/partnership/${partnership.folder}/${fileName}.jpeg`,
              alt: `${partnership.name} ${i}`
            })
          }
          
          if (images.length > 0) {
            partnerships.push({
              name: partnership.name,
              images: images,
              mainImage: images[0].src,
              isExpanded: false
            })
          }
        }
        
        this.partnerships = partnerships
      } catch (error) {
      }
    },
    togglePartnership(index) {
      this.partnerships.forEach((partnership, i) => {
        if (i !== index) {
          partnership.isExpanded = false
        }
      })
      
      this.partnerships[index].isExpanded = !this.partnerships[index].isExpanded
    }
  }
}
</script>

<style scoped>
.portfolio-container {
  max-width: 1200px;
  width: 100%;
  animation: fadeIn 0.8s ease;
}

.portfolio-header {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #520;
  font-family: 'Gilda Display', serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.back-button:hover {
  background: #520;
  color: white;
  transform: translateY(-2px);
}

.header-content {
  text-align: center;
}

.portfolio-title {
  font-family: 'Gilda Display', serif;
  font-size: 2.5rem;
  color: #520;
  margin: 0 0 0.5rem 0;
  font-weight: normal;
  letter-spacing: 2px;
}

.portfolio-subtitle {
  font-family: 'Gilda Display', serif;
  font-size: 1.2rem;
  color: #666;
  margin: 0;
  font-style: italic;
  letter-spacing: 1px;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-family: 'Gilda Display', serif;
  color: #666;
  font-size: 1.2rem;
}

.partnerships-grid {
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .partnerships-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.75rem;
  }
  
  .portfolio-title {
    font-size: 2rem;
  }
  
  .portfolio-subtitle {
    font-size: 1rem;
  }
  
  .portfolio-header {
    padding: 1.5rem;
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
  .portfolio-title {
    font-size: 1.5rem;
  }
  
  .portfolio-subtitle {
    font-size: 0.9rem;
  }
  
  .portfolio-header {
    padding: 1rem;
  }
  
  .back-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .partnerships-grid {
    gap: 1rem;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  }
}
</style>
