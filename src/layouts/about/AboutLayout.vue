<template>
  <div class="about-layout">
    <LanguageSwitcher />
    <div class="layout-content">
      <slot></slot>
      <SiteFooter />
    </div>
  </div>
</template>

<script>
import { LanguageSwitcher, SiteFooter } from '../../components/common'

export default {
  name: 'AboutLayout',
  components: {
    LanguageSwitcher,
    SiteFooter
  }
}
</script>

<style scoped>
.about-layout {
  min-height: 100vh;
  min-width: 100vw;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  display: flex;
  justify-content: center;
  padding: 40px 20px;
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
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 480px) {
  .about-layout {
    padding: 20px;
  }
}
</style>
