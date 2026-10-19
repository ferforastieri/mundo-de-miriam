<template>
  <nav class="navigation">
    <CustomButton variant="outline" size="medium" full-width @click="go('/about')">
      <TranslatableText text="SOBRE MIM" />
    </CustomButton>
    <CustomButton variant="outline" size="medium" full-width @click="go('/curriculum')">
      <TranslatableText text="CURRÍCULO" />
    </CustomButton>
    <CustomButton
      v-for="screen in screens"
      :key="screen.id"
      variant="outline"
      size="medium"
      full-width
      @click="go(screenPath(screen))"
    >
      {{ screen.menuLabel.toUpperCase() }}
    </CustomButton>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { TranslatableText, CustomButton } from '../common'
import { screenPath, usePublicScreens } from '@/composables/usePublicGallery'

const router = useRouter()
const { screens } = usePublicScreens()

function go(path) {
  router.push(path)
}
</script>

<style scoped>
.navigation {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 3rem;
  animation: slideUp 0.5s ease 0.2s backwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
