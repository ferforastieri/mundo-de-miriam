<template>
  <div class="curriculum-layout">
    <div class="layout-container">
      <PageBackButton class="layout-back-button" />
      <slot />
    </div>
  </div>
</template>

<script setup>
import PageBackButton from '@/components/common/PageBackButton.vue'
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

.layout-back-button {
  position: absolute;
  /* Centraliza os 42px do botão na linha tipográfica de 60px do título. */
  top: calc(2rem + 9px);
  left: 2rem;
  z-index: 4;
}

.layout-container :deep(.curriculum-header) {
  position: relative;
  width: 100%;
  min-height: 108px;
  box-sizing: border-box;
  padding: 2rem 2rem 2rem 9rem;
  background: var(--surface);
  border: 1px solid var(--border);
}

.layout-container :deep(.curriculum-header .header-content) {
  width: 100%;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .curriculum-layout {
    padding: 10px;
  }

  /* No mobile, título de 48px e botão de 40px. */
  .layout-back-button { top: calc(1rem + 4px); left: 1rem; }

  .layout-container :deep(.curriculum-header) {
    min-height: 72px;
    padding: 1rem 1rem 1rem 4.5rem;
  }

  .layout-container :deep(.curriculum-header .header-content) {
    align-items: flex-start;
  }
}
</style>
