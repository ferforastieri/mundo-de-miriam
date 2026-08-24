<template>
  <div class="profile-section">
    <div class="profile-image">
      <img src="/assets/profile/fotodalinda.jpg" alt="Miriam Cléres Forastieri" />
    </div>
    
    <div class="profile-info">
      <h1>MIRIAM CLERES FORASTIERI</h1>
      <h2><TranslatableText text="MAQUIADORA E FOTÓGRAFA" /></h2>
      
      <p class="description">
        <TranslatableText text="COMPARTILHANDO SOBRE DIVERSOS PARÂMETROS DA MAQUIAGEM E FOTOGRAFIA" />
      </p>
    </div>
  </div>
</template>

<script>
import { TranslatableText } from '../common'

export default {
  name: 'HomeProfile',
  components: {
    TranslatableText
  }
}
</script>

<style scoped>
.profile-section {
  max-width: 1200px;
  width: 100%;
  animation: fadeIn 0.8s ease;
}

.profile-image {
  width: 150px;
  height: 150px;
  margin: 0 auto 1.25rem;
  position: relative;
  border: 3px solid #520;
  padding: 5px;
  background: white;
  transition: transform 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.02);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 12px;
  height: 12px;
  background-color: #520;
  border-radius: 50%;
  border: 2px solid white;
}

.profile-info {
  text-align: center;
  margin-bottom: 2rem;
  animation: slideUp 0.5s ease;
}

h1 {
  font-family: 'Gilda Display', serif;
  font-size: clamp(2rem, 4vw, 2.6rem);
  color: #520;
  margin: 0;
  font-weight: normal;
  letter-spacing: 3px;
}

h2 {
  font-family: 'Gilda Display', serif;
  font-size: 0.9rem;
  color: #666;
  margin: 0.7rem 0;
  font-weight: normal;
  letter-spacing: 4px;
}

.description {
  font-family: 'Gilda Display', serif;
  max-width: 760px;
  font-size: 1rem;
  line-height: 1.5;
  color: #520;
  margin: 0.7rem auto 0;
  letter-spacing: 1px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.75rem;
  }

  .profile-image {
    width: 120px;
    height: 120px;
  }

  h2 { font-size: 0.78rem; letter-spacing: 2.5px; }
  .description { font-size: 0.9rem; line-height: 1.4; }
}
</style> 
