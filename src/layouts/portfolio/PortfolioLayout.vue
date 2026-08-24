<template>
  <div class="portfolio-layout">
    <div class="layout-content">
      <PageBackButton class="layout-back-button" />
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import PageBackButton from '@/components/common/PageBackButton.vue'
</script>

<style scoped>
.portfolio-layout {
  min-height: 100dvh;
  min-width: 0;
  background: var(--page-bg);
  display: flex;
  justify-content: center;
  padding: 20px 20px 88px;
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

.layout-back-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 4;
}

.layout-content :deep(.portfolio-header) {
  width: 100%;
  min-height: 108px;
  box-sizing: border-box;
  padding: 2rem 8rem;
  background: var(--surface);
  border: 1px solid var(--border);
}

.layout-content :deep(.portfolio-header .header-content) {
  padding-right: 0;
}

@media (max-width: 480px) {
  .portfolio-layout {
    left: 0;
    padding: 10px 10px calc(86px + env(safe-area-inset-bottom));
  }

  .layout-back-button { top: 1rem; left: 1rem; }

  .layout-content :deep(.portfolio-header) {
    min-height: 72px;
    padding: 1rem 1rem 1rem 4.5rem;
  }

  .layout-content :deep(.portfolio-header .header-content) {
    padding-right: 0;
    text-align: left;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .portfolio-layout {
    left: 0;
    padding-bottom: calc(96px + env(safe-area-inset-bottom));
  }
}

</style>
