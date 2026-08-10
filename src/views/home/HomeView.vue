<script setup>
import { useRouter } from 'vue-router'
import HomeLayout from '@/layouts/HomeLayout.vue'
import HomeProfile from '@/components/home/HomeProfile.vue'
import InstagramStats from '@/components/home/InstagramStats.vue'
import HomeNavigation from '@/components/home/HomeNavigation.vue'
import ServicesSection from '@/components/home/ServicesSection.vue'

const router = useRouter()
</script>

<template>
  <HomeLayout>
    <div class="profile-section">
      <HomeProfile />
      <InstagramStats />
      <HomeNavigation />
      <ServicesSection />
    </div>
  </HomeLayout>
</template>

<style scoped>
.profile-section {
  max-width: 600px;
  width: 100%;
  animation: fadeIn 0.8s ease;
}

.services-section {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  text-align: left;
  animation: slideUp 0.5s ease 0.4s backwards;
  transition: transform 0.3s ease;
}

.services-section:hover {
  transform: translateY(-5px);
}

.services-section h3 {
  font-family: 'Gilda Display', serif;
  font-size: 1.8rem;
  color: #520;
  margin: 0;
  font-weight: normal;
  letter-spacing: 1.5px;
}

.services-section p {
  font-family: 'Gilda Display', serif;
  color: #666;
  margin: 12px 0 0;
  font-style: italic;
  letter-spacing: 1px;
  font-size: 1.1rem;
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
</style>
