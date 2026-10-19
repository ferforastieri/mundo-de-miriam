<template>
  <div class="admin-shell">
    <header class="admin-header">
      <div class="admin-header__inner">
        <RouterLink class="admin-brand" to="/admin/dashboard">
          <BrandMark class="admin-brand__mark" />
          <span class="admin-brand__text">
            <span class="admin-brand__eyebrow">Mundo de Miriam</span>
            <span class="admin-brand__title">Painel administrativo</span>
          </span>
        </RouterLink>

        <nav class="admin-nav" aria-label="Navegação do painel">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="admin-nav__link"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <div class="admin-header__actions">
          <button
            class="admin-theme-toggle"
            type="button"
            :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
            :title="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
            @click="toggleTheme"
          >
            <svg v-if="isDark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.7" />
              <path d="M12 2.8v2M12 19.2v2M21.2 12h-2M4.8 12h-2M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4M18.5 18.5l-1.4-1.4M6.9 6.9 5.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20.3 15.4A8.5 8.5 0 0 1 8.6 3.7 8.5 8.5 0 1 0 20.3 15.4Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <a
            class="admin-btn admin-btn--ghost admin-btn--small admin-visit"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver site"
            title="Ver site"
          >
            <svg class="admin-visit__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="admin-visit__label">Ver site</span>
          </a>
          <button class="admin-btn admin-btn--small" type="button" :disabled="loggingOut" @click="handleLogout">
            {{ loggingOut ? 'Saindo…' : 'Sair' }}
          </button>
        </div>
      </div>
    </header>

    <main class="admin-main">
      <RouterView />
    </main>

    <div class="admin-toasts" aria-live="polite">
      <div
        v-for="item in toast.state.items"
        :key="item.id"
        class="admin-toast"
        :class="`admin-toast--${item.type}`"
      >
        <span>{{ item.message }}</span>
        <button class="admin-toast__close" type="button" aria-label="Fechar aviso" @click="toast.remove(item.id)">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { useAdminToast } from '@/composables/useAdminToast'
import { useTheme } from '@/composables/useTheme'
import BrandMark from '@/components/common/BrandMark.vue'

const navItems = [
  { to: '/admin/dashboard', label: 'Visão geral' },
  { to: '/admin/photos', label: 'Fotos' },
  { to: '/admin/screens', label: 'Telas' },
  { to: '/admin/instagram', label: 'Instagram' },
  { to: '/admin/publish', label: 'Publicar' },
  { to: '/admin/account', label: 'Conta' }
]

const router = useRouter()
const { logout } = useAdminAuth()
const { isDark, toggleTheme } = useTheme()
const toast = useAdminToast()
const loggingOut = ref(false)

async function handleLogout() {
  loggingOut.value = true

  try {
    await logout()
    await router.push({ name: 'AdminLogin' })
  } finally {
    loggingOut.value = false
  }
}
</script>
