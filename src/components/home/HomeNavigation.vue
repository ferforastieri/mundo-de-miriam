<template>
  <nav class="navigation">
    <CustomButton variant="outline" size="medium" full-width @click="navigateToAbout">
      <TranslatableText text="SOBRE MIM" />
    </CustomButton>
    <CustomButton variant="outline" size="medium" full-width @click="navigateToArtisticPortfolio">
      <TranslatableText text="MAQUIAGEM ARTISTICA" />
    </CustomButton>
    <CustomButton variant="outline" size="medium" full-width @click="navigateToBeautyPortfolio">
      <TranslatableText text="MAQUIAGEM BEAUTY" />
    </CustomButton>
    <CustomButton variant="outline" size="medium" full-width @click="navigateToEcommerce">
      <TranslatableText text="FOTOGRAFIA E-COMMERCE" />
    </CustomButton>
    <CustomButton variant="outline" size="medium" full-width @click="navigateToPartnerships">
      <TranslatableText text="PARCERIAS" />
    </CustomButton>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router'
import { TranslatableText, CustomButton } from '../common'

export default {
  name: 'HomeNavigation',
  components: {
    TranslatableText,
    CustomButton
  },
  setup() {
    const router = useRouter()
    
    const navigateToBeautyPortfolio = () => {
      router.push('/beauty-portfolio')
    }
    
    const navigateToArtisticPortfolio = () => {
      router.push('/artistic-portfolio')
    }
    
    const navigateToPartnerships = () => {
      router.push('/partnerships')
    }
    
    const navigateToEcommerce = () => {
      router.push('/ecommerce')
    }
    
    const navigateToAbout = () => {
      router.push('/about')
    }
    
    return {
      navigateToAbout,
      navigateToBeautyPortfolio,
      navigateToArtisticPortfolio,
      navigateToPartnerships,
      navigateToEcommerce
    }
  }
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