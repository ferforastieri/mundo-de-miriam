<template>
  <PortfolioLayout>
    <div class="portfolio-container">
      <!-- Header Section -->
      <div class="portfolio-header">
        <div class="header-content">
          <h1 class="portfolio-title">
            <TranslatableText text="Portfólio Beauty" />
          </h1>
          <p class="portfolio-subtitle">
            <TranslatableText text="Descubra minha arte em maquiagem beauty" />
          </p>
        </div>
      </div>

      <!-- Portfolio Gallery -->
      <div v-if="beautyImages.length === 0" class="loading">
        <TranslatableText text="Carregando imagens..." />
      </div>
      <PortfolioGallery v-else :images="beautyImages" />
      
      <!-- Debug -->
      <div v-if="beautyImages.length > 0" class="debug-info">
        {{ beautyImages.length }} <TranslatableText text="imagens carregadas" />
      </div>
    </div>
  </PortfolioLayout>
</template>

<script>
import PortfolioLayout from '@/layouts/portfolio/PortfolioLayout.vue'
import { TranslatableText } from '@/components/common'
import { PortfolioGallery } from '@/components/portfolio'

export default {
  name: 'BeautyPortfolio',
  components: {
    PortfolioLayout,
    TranslatableText,
    PortfolioGallery
  },
  data() {
    return {
      beautyImages: []
    }
  },
  mounted() {
    this.loadBeautyImages()
  },
  methods: {
    async loadBeautyImages() {
      const imageCount = 17
      const images = []
      
      try {
        for (let i = 1; i <= imageCount; i++) {
          images.push({
            src: `/assets/beautystyle/Beauty Style${i}.jpeg`,
            alt: `Beauty Style ${i}`
          })
        }
        
        this.beautyImages = images
      } catch (error) {
      }
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
  display: flex;
  align-items: center;
  gap: 1.25rem;
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
  flex: 0 0 auto;
}

.back-button:hover {
  background: #520;
  color: white;
  transform: translateY(-2px);
}

.header-content {
  flex: 1;
  text-align: center;
  padding-right: 7rem;
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

.debug-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  font-family: 'Gilda Display', serif;
  color: #520;
  font-size: 0.9rem;
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
  .portfolio-header {
    gap: 0.75rem;
  }

  .header-content {
    padding-right: 5rem;
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
}

@media (max-width: 480px) {
  .header-content {
    padding-right: 0;
    text-align: left;
  }

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
}
</style>
