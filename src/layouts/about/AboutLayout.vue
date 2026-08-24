<template>
  <div class="about-layout">
    <div class="layout-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.about-layout {
  min-height: 100dvh;
  width: 100%;
  box-sizing: border-box;
  background: var(--page-bg);
  display: flex;
  justify-content: center;
  padding: 20px;
}

.layout-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  max-width: 1200px;
  margin: 0 auto;
}

.layout-content :deep(.about-header) {
  width: 100%;
  box-sizing: border-box;
  background: var(--surface);
  border: 1px solid var(--border);
}

@media (max-width: 480px) {
  .about-layout {
    padding: 10px;
  }

  .layout-content :deep(.about-header) {
    padding: 1rem;
    gap: 0.75rem;
  }

  .layout-content :deep(.about-header .header-content) {
    padding-right: 0;
    text-align: left;
  }
}
</style>
