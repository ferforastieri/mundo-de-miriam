<template>
  <div class="home-layout">
    <LanguageSwitcher />
    <div class="layout-content">
      <slot></slot>
      <SiteFooter />
    </div>
  </div>
</template>

<script>
import { LanguageSwitcher, SiteFooter } from '../components/common'

export default {
  name: 'HomeLayout',
  components: {
    LanguageSwitcher,
    SiteFooter
  }
}
</script>

<style scoped>
.home-layout {
  min-height: 100dvh;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
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
  .home-layout {
    padding: 20px;
  }
}
</style>
