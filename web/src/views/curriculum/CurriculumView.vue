<template>
  <CurriculumLayout>
    <div class="curriculum-container">
      <CurriculumProfile />
    </div>
  </CurriculumLayout>
</template>

<script setup>
import CurriculumLayout from '@/layouts/curriculum/CurriculumLayout.vue'
import CurriculumProfile from '@/components/curriculum/CurriculumProfile.vue'
</script>

<style scoped>
.curriculum-container {
  max-width: 100%;
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
