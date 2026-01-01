import { createI18n } from 'vue-i18n'
import pt from './locales/pt.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'

const getSavedLanguage = () => {
  try {
    const saved = localStorage.getItem('userLanguagePreference')
    if (saved) return saved
  } catch (error) {
  }
  return null
}

const detectLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage
  const langCode = browserLang.split('-')[0]
  const supportedLanguages = ['pt', 'en', 'es', 'fr', 'ja', 'zh']
  if (supportedLanguages.includes(langCode)) {
    return langCode
  }
  return 'pt'
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLanguage() || detectLanguage(),
  fallbackLocale: 'pt',
  messages: {
    pt,
    en,
    es,
    fr,
    ja,
    zh
  }
})

if (!getSavedLanguage()) {
  i18n.global.locale.value = detectLanguage()
}

window.addEventListener('languagechange', () => {
  if (!getSavedLanguage()) {
    const newLanguage = detectLanguage()
    if (newLanguage !== i18n.global.locale.value) {
      i18n.global.locale.value = newLanguage
    }
  }
})

setInterval(() => {
  if (!getSavedLanguage()) {
    const newLanguage = detectLanguage()
    if (newLanguage !== i18n.global.locale.value) {
      i18n.global.locale.value = newLanguage
    }
  }
}, 5000)

export default i18n
