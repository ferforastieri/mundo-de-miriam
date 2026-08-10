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
  width: 180px;
  height: 180px;
  margin: 0 auto 2rem;
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
  margin-bottom: 3rem;
  animation: slideUp 0.5s ease;
}

h1 {
  font-family: 'Gilda Display', serif;
  font-size: 3rem;
  color: #520;
  margin: 0;
  font-weight: normal;
  letter-spacing: 3px;
}

h2 {
  font-family: 'Gilda Display', serif;
  font-size: 1.1rem;
  color: #666;
  margin: 1rem 0;
  font-weight: normal;
  letter-spacing: 4px;
}

.description {
  font-family: 'Gilda Display', serif;
  font-size: 1.2rem;
  line-height: 1.8;
  color: #520;
  margin: 2rem 0;
  letter-spacing: 1.5px;
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
    font-size: 2rem;
  }

  .profile-image {
    width: 150px;
    height: 150px;
  }
}
</style> 
