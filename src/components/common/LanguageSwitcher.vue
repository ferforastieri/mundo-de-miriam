<template>
  <div class="language-switcher">
    <select 
      v-model="selectedLanguage" 
      @change="changeLanguage"
      class="language-select"
    >
      <option 
        v-for="lang in supportedLanguages" 
        :key="lang.code" 
        :value="lang.code"
      >
        {{ lang.flag }} {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import translationService from '../../api/translation/TranslationService.js'

const { locale } = useI18n()
const selectedLanguage = ref('pt')
const supportedLanguages = ref([])

onMounted(() => {
  supportedLanguages.value = translationService.getSupportedLanguages()
  selectedLanguage.value = locale.value
})

const changeLanguage = () => {
  translationService.setLanguage(selectedLanguage.value, true)
  locale.value = selectedLanguage.value
}
</script>

<style scoped>
.language-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.language-select {
  font-family: 'Gilda Display', serif;
  padding: 8px 12px;
  border: 2px solid #520;
  border-radius: 8px;
  background-color: white;
  color: #520;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.language-select:hover {
  background-color: #520;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.language-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(82, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .language-switcher {
    top: 10px;
    right: 10px;
  }
  
  .language-select {
    padding: 6px 8px;
    font-size: 12px;
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .language-switcher {
    top: 8px;
    right: 8px;
    left: auto;
  }
  
  .language-select {
    padding: 5px 6px;
    font-size: 11px;
    min-width: 90px;
    border-width: 1.5px;
  }
}

@media (max-width: 360px) {
  .language-switcher {
    top: 5px;
    right: 5px;
  }
  
  .language-select {
    padding: 4px 5px;
    font-size: 10px;
    min-width: 80px;
  }
}

@media (max-height: 600px) and (orientation: landscape) {
  .language-switcher {
    top: 5px;
    right: 5px;
  }
  
  .language-select {
    padding: 4px 6px;
    font-size: 11px;
  }
}
</style>
