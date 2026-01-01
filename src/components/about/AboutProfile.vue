<template>
  <div class="about-profile">
    <!-- Header Section -->
    <div class="about-header">
      <button @click="goBack" class="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        <span><TranslatableText text="Voltar" /></span>
      </button>
      
      <div class="header-content">
        <h1 class="about-title">
          <TranslatableText text="Sobre Mim" />
        </h1>
        <p class="about-subtitle">
          <TranslatableText text="Conheça minha história e paixão pela arte da maquiagem" />
        </p>
      </div>
    </div>

    <!-- Profile Section -->
    <div class="profile-section">
      <div class="profile-image">
        <img src="/assets/profile/fotodalinda.jpg" alt="Miriam - Maquiadora" />
      </div>
      
      <div class="profile-content">
        <h2 class="profile-name">
          <TranslatableText text="Miriam" />
        </h2>
        <p class="profile-title">
          <TranslatableText text="Maquiadora Profissional & Fotógrafa" />
        </p>
        
        <div class="profile-description">
          <p>
            <TranslatableText text="Sou apaixonada pela arte da maquiagem há mais de 8 anos, especializando-me em maquiagem artística, beauty e fotografia e-commerce. Minha jornada começou com a curiosidade de transformar rostos em telas em branco, criando verdadeiras obras de arte." />
          </p>
          
          <p>
            <TranslatableText text="Ao longo dos anos, desenvolvi técnicas únicas que combinam tradição e inovação, sempre buscando realçar a beleza natural de cada pessoa. Cada trabalho é uma oportunidade de contar uma história através das cores, texturas e formas." />
          </p>
          
          <p>
            <TranslatableText text="Minha especialização inclui maquiagem para eventos especiais, sessões fotográficas, e-commerce e parcerias com marcas renomadas. Acredito que a maquiagem é uma forma de expressão pessoal e autoestima." />
          </p>
        </div>

        <!-- Skills Section -->
        <div class="skills-section">
          <h3><TranslatableText text="Especialidades" /></h3>
          <div class="skills-grid">
            <div class="skill-item">
              <h4><TranslatableText text="Maquiagem Artística" /></h4>
              <p><TranslatableText text="Criações únicas e expressivas para eventos especiais" /></p>
            </div>
            <div class="skill-item">
              <h4><TranslatableText text="Maquiagem Beauty" /></h4>
              <p><TranslatableText text="Realce da beleza natural com técnicas profissionais" /></p>
            </div>
            <div class="skill-item">
              <h4><TranslatableText text="Fotografia E-commerce" /></h4>
              <p><TranslatableText text="Produção visual para marcas e produtos" /></p>
            </div>
            <div class="skill-item">
              <h4><TranslatableText text="Parcerias" /></h4>
              <p><TranslatableText text="Colaborações com marcas e influenciadores" /></p>
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="contact-section">
          <h3><TranslatableText text="Entre em Contato" /></h3>
          <p><TranslatableText text="Pronta para transformar sua visão em realidade? Vamos conversar sobre seu próximo projeto!" /></p>
        </div>

        <!-- Curriculum Section -->
        <div class="curriculum-section">
          <h3><TranslatableText text="Currículo Profissional" /></h3>
          <p><TranslatableText text="Conheça minha experiência profissional completa e baixe meu currículo em PDF." /></p>
          <button @click="goToCurriculum" class="curriculum-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            <span><TranslatableText text="Ver Currículo" /></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { TranslatableText } from '../common'

export default {
  name: 'AboutProfile',
  components: {
    TranslatableText
  },
  setup() {
    const router = useRouter()
    
    const goBack = () => {
      router.push('/')
    }

    const goToCurriculum = () => {
      router.push('/curriculum')
    }
    
    return {
      goBack,
      goToCurriculum
    }
  }
}
</script>

<style scoped>
.about-profile {
  max-width: 800px;
  width: 100%;
  animation: fadeIn 0.8s ease;
}

.about-header {
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

.about-title {
  font-family: 'Gilda Display', serif;
  font-size: 2.5rem;
  color: #520;
  margin: 0 0 0.5rem 0;
  font-weight: normal;
  letter-spacing: 2px;
}

.about-subtitle {
  font-family: 'Gilda Display', serif;
  font-size: 1.2rem;
  color: #666;
  margin: 0;
  font-style: italic;
  letter-spacing: 1px;
}

.profile-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-image {
  margin-bottom: 2rem;
}

.profile-image img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #520;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.profile-content {
  max-width: 600px;
}

.profile-name {
  font-family: 'Gilda Display', serif;
  font-size: 2.2rem;
  color: #520;
  margin: 0 0 0.5rem 0;
  font-weight: normal;
  letter-spacing: 1px;
}

.profile-title {
  font-family: 'Gilda Display', serif;
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 2rem 0;
  font-style: italic;
  letter-spacing: 1px;
}

.profile-description {
  text-align: left;
  margin-bottom: 2rem;
}

.profile-description p {
  font-family: 'Gilda Display', serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1rem;
}

.skills-section {
  margin-bottom: 2rem;
}

.skills-section h3 {
  font-family: 'Gilda Display', serif;
  font-size: 1.8rem;
  color: #520;
  margin: 0 0 1.5rem 0;
  font-weight: normal;
  letter-spacing: 1px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.skill-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #520;
}

.skill-item h4 {
  font-family: 'Gilda Display', serif;
  font-size: 1.2rem;
  color: #520;
  margin: 0 0 0.5rem 0;
  font-weight: normal;
}

.skill-item p {
  font-family: 'Gilda Display', serif;
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.contact-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.contact-section h3 {
  font-family: 'Gilda Display', serif;
  font-size: 1.5rem;
  color: #520;
  margin: 0 0 1rem 0;
  font-weight: normal;
}

.contact-section p {
  font-family: 'Gilda Display', serif;
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.curriculum-section {
  background: #520;
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 2rem;
}

.curriculum-section h3 {
  font-family: 'Gilda Display', serif;
  font-size: 1.5rem;
  color: white;
  margin: 0 0 1rem 0;
  font-weight: normal;
}

.curriculum-section p {
  font-family: 'Gilda Display', serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.curriculum-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #520;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-family: 'Gilda Display', serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.curriculum-button:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
  .about-title {
    font-size: 2rem;
  }
  
  .about-subtitle {
    font-size: 1rem;
  }
  
  .about-header, .profile-section {
    padding: 1.5rem;
  }
  
  .profile-image img {
    width: 150px;
    height: 150px;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .about-title {
    font-size: 1.5rem;
  }
  
  .about-subtitle {
    font-size: 0.9rem;
  }
  
  .about-header, .profile-section {
    padding: 1rem;
  }
  
  .profile-image img {
    width: 120px;
    height: 120px;
  }
  
  .back-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
