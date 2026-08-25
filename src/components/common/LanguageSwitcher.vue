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
    <span v-if="embedded" class="language-switcher__label" aria-hidden="true">Idioma</span>
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

.language-switcher__label { display: none; }

@media (max-width: 768px) {
  .language-switcher.language-switcher--embedded {
    display: grid;
    grid-template-rows: 22px auto;
    width: 50px;
    height: 50px;
    place-items: center;
    align-content: center;
    gap: 0.15rem;
    color: var(--muted);
  }

  .language-switcher__label {
    display: block;
    font-family: system-ui, sans-serif;
    font-size: 0.58rem;
    line-height: 10px;
    letter-spacing: 0.04em;
  }
}
</style>
