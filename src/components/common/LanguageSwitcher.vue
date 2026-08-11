<template>
  <div class="language-switcher" :class="{ 'language-switcher--embedded': embedded, 'language-switcher--drawer': drawer }">
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

onMounted(() => {
  supportedLanguages.value = translationService.getSupportedLanguages()
  selectedLanguage.value = locale.value
})

const changeLanguage = () => {
  translationService.setLanguage(selectedLanguage.value, true)
  locale.value = selectedLanguage.value
}
</script>

<style>
.language-switcher {
  position: fixed;
  top: max(12px, env(safe-area-inset-top));
  right: max(12px, env(safe-area-inset-right));
  z-index: 10002;
  display: flex;
  justify-content: flex-end;
}

.language-switcher.language-switcher--embedded {
  position: relative;
  top: auto;
  right: auto;
  z-index: auto;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(85, 34, 0, 0.2);
  border-radius: 50%;
  background: var(--surface);
  color: var(--primary);
}

.language-switcher.language-switcher--drawer {
  position: static;
  width: auto;
  height: auto;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.language-switcher.language-switcher--drawer .language-select {
  position: static;
  width: auto;
  min-width: 120px;
  height: auto;
  padding: 8px 12px;
  opacity: 1;
  background: var(--surface);
  color: var(--primary);
  border-color: var(--primary);
}

.language-switcher.language-switcher--embedded::before {
  content: "🌐";
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  pointer-events: none;
}

.language-switcher.language-switcher--embedded .language-select {
  position: absolute;
  inset: 0;
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0;
  opacity: 0;
  cursor: pointer;
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
  .language-select {
    padding: 6px 8px;
    font-size: 12px;
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .language-select {
    padding: 5px 6px;
    font-size: 11px;
    min-width: 90px;
    border-width: 1.5px;
  }
}

@media (max-width: 360px) {
  .language-select {
    padding: 4px 5px;
    font-size: 10px;
    min-width: 80px;
  }
}

@media (max-height: 600px) and (orientation: landscape) {
  .language-select {
    padding: 4px 6px;
    font-size: 11px;
  }
}
</style>
