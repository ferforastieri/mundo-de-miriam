<template>
  <div class="language-switcher" :class="{ 'language-switcher--embedded': embedded, 'language-switcher--drawer': drawer }">
    <StyledSelect
      v-model="selectedLanguage"
      :options="languageOptions"
      :compact="embedded"
      aria-label="Selecionar idioma"
      placement="top"
      @change="changeLanguage"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import translationService from '../../api/translation/TranslationService.js'
import StyledSelect from './StyledSelect.vue'

defineProps({
  embedded: {
    type: Boolean,
    default: false
  },
  drawer: {
    type: Boolean,
    default: false
  }
})

const { locale } = useI18n()
const selectedLanguage = ref('pt')
const supportedLanguages = ref([])
const languageOptions = computed(() => supportedLanguages.value.map((language) => ({
  value: language.code,
  label: `${language.flag} ${language.name}`,
  shortLabel: language.code.toUpperCase()
})))

onMounted(() => {
  supportedLanguages.value = translationService.getSupportedLanguages()
  selectedLanguage.value = locale.value
})

const changeLanguage = (language) => {
  translationService.setLanguage(language, true)
  locale.value = language
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  justify-content: flex-end;
}

.language-switcher.language-switcher--embedded {
  position: relative;
  width: 42px;
  height: 42px;
}

.language-switcher.language-switcher--drawer {
  position: static;
  width: auto;
  height: auto;
}
</style>
