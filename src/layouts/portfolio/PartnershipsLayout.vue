<template>
  <div class="partnerships-layout">
    <div class="layout-content">
      <slot></slot>
      <SiteFooter />
    </div>
  </div>
</template>

<script>
import { SiteFooter } from '../../components/common'

export default {
  name: 'PartnershipsLayout',
  components: {
    SiteFooter
  }
}
</script>

<style scoped>
.partnerships-layout {
  min-height: 100vh;
  min-width: 100vw;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  display: flex;
  justify-content: center;
  padding: 20px;
  position: fixed;
  top: 0;
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
}

@media (max-width: 480px) {
  .partnerships-layout {
    padding: 10px;
  }
}
</style>
