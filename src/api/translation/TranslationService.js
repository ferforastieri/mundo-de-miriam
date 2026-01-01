import i18n from '../../i18n'

class TranslationService {
  constructor() {
    this.baseLanguage = 'pt'
    this.userLanguagePreference = null
    this.currentLanguage = this.loadUserPreference() || this.detectLanguage()
    this.setupLanguageChangeListener()
  }

  loadUserPreference() {
    try {
      const saved = localStorage.getItem('userLanguagePreference')
      if (saved) {
        this.userLanguagePreference = saved
        return saved
      }
    } catch (error) {
    }
    return null
  }

  saveUserPreference(langCode) {
    try {
      localStorage.setItem('userLanguagePreference', langCode)
      this.userLanguagePreference = langCode
    } catch (error) {
    }
  }

  detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage
    const langCode = browserLang.split('-')[0]
    const supportedLanguages = ['pt', 'en', 'es', 'fr', 'ja', 'zh']
    if (supportedLanguages.includes(langCode)) {
      return langCode
    }
    return 'pt'
  }

  setupLanguageChangeListener() {
    window.addEventListener('languagechange', () => {
      if (!this.userLanguagePreference) {
        const newLanguage = this.detectLanguage()
        if (newLanguage !== this.currentLanguage) {
          this.setLanguage(newLanguage)
          window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: newLanguage }
          }))
        }
      }
    })

    setInterval(() => {
      if (!this.userLanguagePreference) {
        const newLanguage = this.detectLanguage()
        if (newLanguage !== this.currentLanguage) {
          this.setLanguage(newLanguage)
          window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: newLanguage }
          }))
        }
      }
    }, 5000)
  }

  translateText(text) {
    if (!text || typeof text !== 'string') {
      return text
    }

    if (this.currentLanguage === this.baseLanguage) {
      return text
    }

    const translation = i18n.global.t(text)
    return translation !== text ? translation : text
  }

  translateTexts(texts) {
    return texts.map(text => this.translateText(text))
  }

  setLanguage(langCode, isUserChoice = false) {
    const supportedLanguages = ['pt', 'en', 'es', 'fr', 'ja', 'zh']
    if (!supportedLanguages.includes(langCode)) {
      return
    }

    this.currentLanguage = langCode
    i18n.global.locale.value = langCode

    if (isUserChoice) {
      this.saveUserPreference(langCode)
    }

    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: langCode }
    }))
  }

  getCurrentLanguage() {
    return i18n.global.locale.value
  }

  getSupportedLanguages() {
    return [
      { code: 'pt', name: 'Português', flag: '🇧🇷' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'zh', name: '中文', flag: '🇨🇳' }
    ]
  }

  clearUserPreference() {
    try {
      localStorage.removeItem('userLanguagePreference')
      this.userLanguagePreference = null
      const newLanguage = this.detectLanguage()
      this.setLanguage(newLanguage)
    } catch (error) {
    }
  }
}

const translationService = new TranslationService()

export default translationService
