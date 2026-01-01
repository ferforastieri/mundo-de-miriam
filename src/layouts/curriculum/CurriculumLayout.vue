<template>
  <div class="curriculum-layout">
    <div class="layout-container">
      <slot />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.curriculum-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.layout-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .curriculum-layout {
    padding: 1rem 0.5rem;
  }
}
</style>
