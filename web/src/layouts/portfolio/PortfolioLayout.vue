<template>
  <div class="portfolio-layout">
    <div class="layout-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.portfolio-layout {
  min-height: 100dvh;
  min-width: 0;
  background: var(--page-bg);
  display: flex;
  justify-content: center;
  padding: 20px 20px 120px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}

.layout-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 480px) {
  .portfolio-layout {
    left: 0;
    padding: 10px 10px calc(120px + env(safe-area-inset-bottom));
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .portfolio-layout {
    left: 0;
    padding-bottom: calc(96px + env(safe-area-inset-bottom));
  }
}

</style>
