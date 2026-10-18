import { ref } from 'vue'

const isDark = ref(false)

function applyTheme(dark) {
  isDark.value = dark

  const root = document.documentElement
  root.dataset.theme = dark ? 'dark' : 'light'
  root.style.colorScheme = dark ? 'dark' : 'light'

  try {
    localStorage.setItem('themePreference', dark ? 'dark' : 'light')
  } catch {
    // sem localStorage, o tema continua válido para a sessão
  }
}

function initTheme() {
  let savedTheme = null

  try {
    savedTheme = localStorage.getItem('themePreference')
  } catch {
    savedTheme = null
  }

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  applyTheme(savedTheme ? savedTheme === 'dark' : Boolean(prefersDark))
}

function toggleTheme() {
  applyTheme(!isDark.value)
}

export function useTheme() {
  return { isDark, initTheme, toggleTheme }
}
