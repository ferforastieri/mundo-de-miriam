<script setup>
import LanguageSwitcher from './components/common/LanguageSwitcher.vue'
import NavigationDrawer from './components/common/NavigationDrawer.vue'
</script>

<template>
  <div class="app">
    <header class="site-header">
      <div class="site-header__left">
        <NavigationDrawer />
      </div>
      <RouterLink to="/" class="site-logo" aria-label="Página inicial">
        <img src="/apple-touch-icon.png" alt="Mundo de Miriam" />
      </RouterLink>
      <div class="site-header__right">
        <LanguageSwitcher embedded />
      </div>
    </header>
    <main class="site-page">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
}

.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 10002;
  display: grid;
  grid-template-columns: minmax(42px, 1fr) auto minmax(42px, 1fr);
  align-items: center;
  min-height: calc(68px + env(safe-area-inset-top));
  padding: max(8px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) 8px max(12px, env(safe-area-inset-left));
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid rgba(85, 34, 0, 0.16);
  box-shadow: 0 3px 14px rgba(31, 15, 7, 0.08);
}

.site-header__left,
.site-header__right {
  display: flex;
  align-items: center;
}

.site-header__right {
  justify-content: flex-end;
}

.site-logo {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
}

.site-logo img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(85, 34, 0, 0.18);
}

.site-page {
  padding-top: calc(68px + env(safe-area-inset-top));
}

@media (max-width: 480px) {
  .site-logo {
    width: 42px;
    height: 42px;
  }

  .site-logo img {
    width: 40px;
    height: 40px;
  }
}
</style>
