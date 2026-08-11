<template>
  <div class="portfolio-layout">
    <div class="layout-content">
      <slot></slot>
      <SiteFooter />
    </div>
  </div>
</template>

<script>
import { SiteFooter } from '../../components/common'

export default {
  name: 'PortfolioLayout',
  components: {
    SiteFooter
  }
}
</script>

<style scoped>
.portfolio-layout {
  min-height: 100vh;
  min-width: 100vw;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  display: flex;
  justify-content: center;
  padding: 20px;
  position: fixed;
  top: calc(68px + env(safe-area-inset-top));
  left: 0;
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
  .portfolio-layout {
    padding: 10px;
  }
}
</style>
