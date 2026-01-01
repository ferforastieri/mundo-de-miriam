<template>
  <div class="services-section">
    <div class="services-content">
      <div class="text-content">
        <div class="title-section">
          <h2 class="title"><TranslatableText text="Fale Comigo" /></h2>
          <div class="subtitle-container">
            <span class="subtitle-inline"><TranslatableText text="Entre em contato e vamos conversar sobre seu projeto!" /></span>
          </div>
        </div>
        
        <div class="contact-info">
          <div class="contact-item">
            <div class="contact-icon whatsapp-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <a href="https://wa.me/5515920029139" target="_blank" class="contact-link">
              <TranslatableText text="WhatsApp: (15) 92002-9139" />
            </a>
          </div>
          
          <div class="contact-item">
            <div class="contact-icon email-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <a href="mailto:cleresmimakeup@gmail.com" class="contact-link">
              cleresmimakeup@gmail.com
            </a>
          </div>
          
          <div class="contact-item">
            <div class="contact-icon instagram-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <a href="https://instagram.com/mihforastieri" target="_blank" class="contact-link">
              @mihforastieri
            </a>
          </div>
        </div>
        
      </div>
      <div class="image-content">
        <img src="/assets/profile/fundo-cursos.jpg" alt="Miriam Cléres - Fale Comigo" />
      </div>
    </div>
  </div>
</template>

<script>
import { TranslatableText, CustomButton } from '../common'

export default {
  name: 'ServicesSection',
  components: {
    TranslatableText,
    CustomButton
  },
  methods: {
    openWhatsApp() {
      window.open('https://wa.me/5515920029139', '_blank')
    }
  }
}
</script>

<style scoped>
.services-section {
  width: 100%;
  margin: 1rem 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  transition: transform 0.3s ease;
}

.services-section:hover {
  transform: translateY(-5px);
}

.services-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.text-content {
  flex: 1;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.subtitle-inline {
  font-family: 'Gilda Display', serif;
  font-size: 1.2rem;
  color: #666;
  font-style: italic;
  letter-spacing: 1.5px;
}

.image-content {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid #520;
  padding: 3px;
  background: white;
  flex-shrink: 0;
}

.image-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.title {
  font-family: 'Gilda Display', serif;
  font-size: 2rem;
  color: #520;
  margin: 0;
  font-weight: normal;
  letter-spacing: 2px;
}


.contact-info {
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 0;
}

.contact-icon {
  font-size: 1.4rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.whatsapp-icon {
  background: #25D366;
  color: white;
}

.email-icon {
  background: #EA4335;
  color: white;
}

.instagram-icon {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: white;
}

.contact-link {
  font-family: 'Gilda Display', serif;
  color: #520;
  text-decoration: none;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #333;
  text-decoration: underline;
}

.contact-item:hover .contact-icon {
  transform: scale(1.1);
}

.contact-item:hover .whatsapp-icon {
  background: #128C7E;
}

.contact-item:hover .email-icon {
  background: #D33B2C;
}

.contact-item:hover .instagram-icon {
  transform: scale(1.1) rotate(5deg);
}


@media (max-width: 480px) {
  .services-section {
    padding: 1rem;
  }

  .services-content {
    flex-direction: column-reverse;
    gap: 1rem;
    text-align: center;
  }

  .image-content {
    width: 160px;
    height: 160px;
    margin: 0 auto;
  }

  .title-section {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }

  .subtitle-inline {
    font-size: 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 1rem;
    margin: 0.8rem 0 1.5rem;
  }

  .contact-info {
    margin: 0.5rem 0;
    gap: 0.4rem;
    align-items: center;
  }

  .contact-item {
    gap: 0.6rem;
    padding: 0.4rem 0;
  }

  .contact-link {
    font-size: 0.9rem;
  }

}
</style> 