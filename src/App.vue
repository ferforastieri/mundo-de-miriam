<script setup>
import LanguageSwitcher from './components/common/LanguageSwitcher.vue'
import NavigationDrawer from './components/common/NavigationDrawer.vue'
</script>

<template>
  <div class="app">
    <LanguageSwitcher />
    <NavigationDrawer />
    <router-view />
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
}
</style>
