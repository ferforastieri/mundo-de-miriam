<template>
  <div class="about-layout">
    <div class="layout-content">
      <slot></slot>
      <SiteFooter />
    </div>
  </div>
</template>

<script>
import { SiteFooter } from '../../components/common'

export default {
  name: 'AboutLayout',
  components: {
    SiteFooter
  }
}
</script>

<style scoped>
.about-layout {
  min-height: 100dvh;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  display: flex;
  justify-content: center;
  padding: 40px 20px;
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
    padding: 20px;
  }
}
</style>
