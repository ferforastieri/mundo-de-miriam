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

@media (max-width: 480px) {
  .about-layout {
    padding: 10px;
  }

}
</style>
