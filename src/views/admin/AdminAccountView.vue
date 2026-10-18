<template>
  <div>
    <header class="admin-page-header">
      <div>
        <h1 class="admin-title">Conta</h1>
        <p class="admin-subtitle">
          Dados de acesso e segurança do painel administrativo.
        </p>
      </div>
    </header>

    <div class="admin-grid-2">
      <section class="admin-card">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title">Identificação</h2>
            <p class="admin-card__hint">Conta usada para entrar no painel</p>
          </div>
        </div>

        <table class="admin-table">
          <tbody>
            <tr>
              <th>E-mail</th>
              <td>{{ admin?.email || '—' }}</td>
            </tr>
            <tr>
              <th>Último login</th>
              <td>{{ formatDateTime(admin?.lastLoginAt) }}</td>
            </tr>
            <tr>
              <th>Sessão</th>
              <td>Cookie httpOnly · Secure · SameSite=Strict · 30 dias</td>
            </tr>
          </tbody>
        </table>

        <p class="admin-card__hint account-note">
          A sessão fica em um cookie que não pode ser lido por JavaScript. As rotas do painel também validam
          a origem das requisições e limitam tentativas de login.
        </p>
      </section>

      <section class="admin-card">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title">Alterar senha</h2>
            <p class="admin-card__hint">As outras sessões abertas serão encerradas</p>
          </div>
        </div>

        <form class="admin-stack" @submit.prevent="submitPassword">
          <label class="admin-field">
            <span class="admin-label">Senha atual</span>
            <input
              v-model="currentPassword"
              class="admin-input"
              type="password"
              autocomplete="current-password"
              required
            />
          </label>

          <label class="admin-field">
            <span class="admin-label">Nova senha</span>
            <input
              v-model="newPassword"
              class="admin-input"
              type="password"
              autocomplete="new-password"
              minlength="12"
              required
            />
          </label>

          <label class="admin-field">
            <span class="admin-label">Confirmar nova senha</span>
            <input
              v-model="confirmPassword"
              class="admin-input"
              type="password"
              autocomplete="new-password"
              minlength="12"
              required
            />
          </label>

          <p class="admin-card__hint">Use pelo menos 12 caracteres e não reaproveite a senha atual.</p>

          <div class="admin-actions-row">
            <button class="admin-btn admin-btn--primary" type="submit" :disabled="saving">
              {{ saving ? 'Salvando…' : 'Salvar nova senha' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import adminService from '@/api/admin/AdminService.js'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { useAdminToast } from '@/composables/useAdminToast'
import { formatDateTime } from '@/utils/format.js'

const { state } = useAdminAuth()
const toast = useAdminToast()

const admin = computed(() => state.admin)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)

async function submitPassword() {
  if (newPassword.value.length < 12) {
    toast.error('A nova senha precisa ter pelo menos 12 caracteres.')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error('A confirmação não confere com a nova senha.')
    return
  }

  saving.value = true

  try {
    await adminService.changePassword(currentPassword.value, newPassword.value)
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    toast.success('Senha atualizada. As outras sessões foram encerradas.')
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível alterar a senha.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.account-note {
  margin-top: 0.9rem;
}
</style>
