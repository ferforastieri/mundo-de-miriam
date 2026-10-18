<template>
  <div class="admin-login">
    <div class="admin-login__card">
      <BrandMark class="admin-login__mark" />
      <span class="admin-login__eyebrow">Mundo de Miriam</span>
      <h1 class="admin-login__title">Painel administrativo</h1>
      <p class="admin-login__hint">
        Acesso restrito. Entre com o e-mail e a senha cadastrados para gerenciar o site.
      </p>

      <form class="admin-login__form" @submit.prevent="submit">
        <label class="admin-field">
          <span class="admin-label">E-mail</span>
          <input
            v-model="email"
            class="admin-input"
            type="email"
            name="email"
            autocomplete="username"
            required
            autofocus
            placeholder="seu@email.com"
          />
        </label>

        <label class="admin-field">
          <span class="admin-label">Senha</span>
          <input
            v-model="password"
            class="admin-input"
            type="password"
            name="password"
            autocomplete="current-password"
            required
            placeholder="••••••••••••"
          />
        </label>

        <p v-if="error" class="admin-alert admin-alert--error" role="alert">{{ error }}</p>

        <button class="admin-btn admin-btn--primary admin-login__submit" type="submit" :disabled="loading">
          {{ loading ? 'Entrando…' : 'Entrar no painel' }}
        </button>
      </form>

      <RouterLink class="admin-login__back" to="/">← Voltar ao site</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'
import BrandMark from '@/components/common/BrandMark.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const route = useRoute()
const router = useRouter()
const { login } = useAdminAuth()

async function submit() {
  error.value = ''
  loading.value = true

  try {
    await login(email.value.trim(), password.value)
    password.value = ''

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    await router.replace(redirect && redirect.startsWith('/admin') ? redirect : { name: 'AdminDashboard' })
  } catch (requestError) {
    error.value = requestError.message || 'Não foi possível entrar.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
}

.admin-login__card {
  width: min(430px, 100%);
  padding: clamp(1.5rem, 4vw, 2.4rem);
  border: 1px solid var(--border);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 30px 70px rgba(85, 34, 0, 0.12);
}

.admin-login__mark {
  --mark-size: 72px;
  display: grid;
  margin: 0 auto 1.1rem;
}

.admin-login__eyebrow {
  color: #8a6a55;
  font-family: system-ui, sans-serif;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.admin-login__title {
  margin: 0.4rem 0 0.5rem;
  color: #552200;
  font-size: clamp(1.6rem, 4vw, 2rem);
  font-weight: normal;
  line-height: 1.1;
}

.admin-login__hint {
  margin: 0 0 1.4rem;
  color: #6d5a50;
  font-family: system-ui, sans-serif;
  font-size: 0.86rem;
  line-height: 1.5;
}

.admin-login__form {
  display: grid;
  gap: 0.9rem;
}

.admin-login__submit {
  width: 100%;
  margin-top: 0.2rem;
  padding: 0.7rem 1rem;
}

.admin-login__back {
  display: inline-block;
  margin-top: 1.25rem;
  color: #8a6a55;
  font-family: system-ui, sans-serif;
  font-size: 0.78rem;
  text-decoration: none;
}

.admin-login__back:hover {
  color: #552200;
}

:global(html[data-theme="dark"] .admin-login) {
  background: var(--page-bg);
}

:global(html[data-theme="dark"] .admin-login__card) {
  background: var(--surface);
  border-color: var(--border);
}

:global(html[data-theme="dark"] .admin-login__title) {
  color: var(--primary);
}

:global(html[data-theme="dark"] .admin-login__hint),
:global(html[data-theme="dark"] .admin-login__back),
:global(html[data-theme="dark"] .admin-login__eyebrow) {
  color: var(--muted);
}
</style>
