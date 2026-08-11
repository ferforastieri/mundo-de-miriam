<script setup>
import LanguageSwitcher from './components/common/LanguageSwitcher.vue'
</script>

<template>
  <div class="app">
    <LanguageSwitcher />
    <router-view />
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
}
</style>
