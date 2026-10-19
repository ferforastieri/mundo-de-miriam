<template>
  <span
    class="skeleton-block"
    :class="{ 'skeleton-block--circle': circle }"
    :style="style"
    aria-hidden="true"
  ></span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '1rem' },
  radius: { type: String, default: '10px' },
  circle: { type: Boolean, default: false }
})

const style = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.circle ? '50%' : props.radius
}))
</script>

<style scoped>
.skeleton-block {
  display: block;
  background: linear-gradient(
    100deg,
    var(--skeleton-base) 30%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 70%
  );
  background-size: 220% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  from { background-position: 130% 0; }
  to { background-position: -30% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-block { animation: none; }
}
</style>
