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
  min-height: 100dvh;
  width: 100%;
  box-sizing: border-box;
  background: var(--page-bg);
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.layout-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .curriculum-layout {
    padding: 10px;
  }

}
</style>
