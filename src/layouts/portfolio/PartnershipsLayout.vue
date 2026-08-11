<template>
  <div class="partnerships-layout">
    <div class="layout-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.partnerships-layout {
  min-height: 100vh;
  min-width: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  display: flex;
  justify-content: center;
  padding: 20px;
  position: fixed;
  top: calc(68px + env(safe-area-inset-top));
  left: var(--desktop-drawer-offset);
  right: 0;
  bottom: 0;
  overflow-y: auto;
}

.layout-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 480px) {
  .partnerships-layout {
    left: 0;
    padding: 10px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .partnerships-layout {
    left: 0;
    padding-bottom: 20px;
  }
}

@media (min-width: 769px) {
  .partnerships-layout {
    top: 0;
  }
}
</style>
