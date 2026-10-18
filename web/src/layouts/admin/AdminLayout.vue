<template>
  <div class="admin-shell">
    <header class="admin-header">
      <div class="admin-header__inner">
        <RouterLink class="admin-brand" to="/admin/dashboard">
          <span class="admin-brand__eyebrow">Mundo de Miriam</span>
          <span class="admin-brand__title">Painel administrativo</span>
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
          <a class="admin-btn admin-btn--ghost admin-btn--small" href="/" target="_blank" rel="noopener noreferrer">
            Ver site ↗
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
