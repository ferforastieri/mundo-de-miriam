<template>
  <div class="gallery-skeleton" aria-hidden="true">
    <div v-for="index in count" :key="index" class="gallery-skeleton__item">
      <SkeletonBlock height="100%" radius="16px" />
    </div>
  </div>
</template>

<script setup>
import SkeletonBlock from '@/components/common/SkeletonBlock.vue'

defineProps({
  count: { type: Number, default: 8 }
})
</script>

<style scoped>
.gallery-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
}

.gallery-skeleton__item {
  aspect-ratio: 4 / 5;
}

@media (max-width: 640px) {
  .gallery-skeleton {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.9rem;
  }
}
</style>
