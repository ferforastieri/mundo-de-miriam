<template>
  <div class="admin-shell">
    <header class="admin-header">
      <div class="admin-header__inner">
        <button
          class="admin-menu-button"
          type="button"
          aria-label="Abrir menu do painel"
          :aria-expanded="navOpen"
          @click="navOpen = true"
        >
          <AdminIcon name="menu" />
        </button>

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
            <AdminIcon :name="item.icon" />
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
            <AdminIcon :name="isDark ? 'sun' : 'moon'" />
          </button>

          <div ref="userMenuRef" class="admin-user">
            <button
              class="admin-user__trigger"
              type="button"
              aria-haspopup="menu"
              :aria-expanded="userMenuOpen"
              aria-label="Abrir menu da conta"
              @click="userMenuOpen = !userMenuOpen"
            >
              <img
                v-if="admin?.avatarUrl"
                class="admin-user__avatar"
                :src="admin.avatarUrl"
                alt=""
              />
              <span v-else class="admin-user__avatar admin-user__avatar--initials">{{ initials }}</span>
              <AdminIcon name="chevronDown" class="admin-user__caret" />
            </button>

            <Transition name="admin-dropdown">
              <div v-if="userMenuOpen" class="admin-user__menu" role="menu">
                <p v-if="admin?.email" class="admin-user__identity">{{ admin.email }}</p>
                <RouterLink
                  class="admin-user__item"
                  :to="{ name: 'AdminAccount' }"
                  role="menuitem"
                  @click="userMenuOpen = false"
                >
                  <AdminIcon name="user" />
                  Minha conta
                </RouterLink>
                <button
                  class="admin-user__item admin-user__item--danger"
                  type="button"
                  role="menuitem"
                  :disabled="loggingOut"
                  @click="handleLogout"
                >
                  <AdminIcon name="logout" />
                  {{ loggingOut ? 'Saindo…' : 'Sair' }}
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>


    <Teleport to="body">
      <Transition name="admin-drawer">
        <div v-if="navOpen" class="admin-drawer" @click.self="navOpen = false">
          <aside class="admin-drawer__panel" role="dialog" aria-modal="true" aria-label="Menu do painel">
            <header class="admin-drawer__head">
              <span class="admin-drawer__brand">
                <BrandMark class="admin-drawer__mark" />
                Mundo de Miriam
              </span>
              <button class="admin-drawer__close" type="button" aria-label="Fechar menu" @click="navOpen = false">
                <AdminIcon name="close" />
              </button>
            </header>

            <nav class="admin-drawer__nav">
              <RouterLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="admin-drawer__link"
                @click="navOpen = false"
              >
                <AdminIcon :name="item.icon" />
                {{ item.label }}
              </RouterLink>
            </nav>

            <div class="admin-drawer__footer">
              <RouterLink
                :to="{ name: 'AdminAccount' }"
                class="admin-drawer__link"
                @click="navOpen = false"
              >
                <AdminIcon name="user" />
                Minha conta
              </RouterLink>
              <button class="admin-drawer__link" type="button" :disabled="loggingOut" @click="handleLogout">
                <AdminIcon name="logout" />
                {{ loggingOut ? 'Saindo…' : 'Sair' }}
              </button>
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>

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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { useAdminToast } from '@/composables/useAdminToast'
import { useTheme } from '@/composables/useTheme'
import BrandMark from '@/components/common/BrandMark.vue'
import AdminIcon from '@/components/admin/AdminIcon.vue'

const navItems = [
  { to: '/admin/dashboard', label: 'Visão geral', icon: 'dashboard' },
  { to: '/admin/photos', label: 'Fotos', icon: 'image' },
  { to: '/admin/screens', label: 'Telas', icon: 'layers' },
  { to: '/admin/instagram', label: 'Instagram', icon: 'instagram' },
  { to: '/admin/publish', label: 'Publicar', icon: 'send' }
]

const router = useRouter()
const route = useRoute()
const { state: authState, logout, loadMe } = useAdminAuth()
const { isDark, toggleTheme } = useTheme()
const toast = useAdminToast()

const admin = computed(() => authState.admin)
const initials = computed(() => (admin.value?.email || 'M').slice(0, 1).toUpperCase())

const navOpen = ref(false)
const userMenuOpen = ref(false)
const userMenuRef = ref(null)
const loggingOut = ref(false)

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  loadMe()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})

function onDocumentClick(event) {
  if (!userMenuOpen.value) return
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    userMenuOpen.value = false
  }
}

watch(
  () => route.path,
  () => {
    navOpen.value = false
    userMenuOpen.value = false
  }
)

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
