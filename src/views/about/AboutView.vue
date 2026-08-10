<template>
  <AboutLayout>
    <div class="about-container">
      <AboutProfile />
    </div>
  </AboutLayout>
</template>

<script setup>
import AboutLayout from '@/layouts/about/AboutLayout.vue'
import AboutProfile from '@/components/about/AboutProfile.vue'
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  width: 100%;
  animation: fadeIn 0.8s ease;
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
</style>
