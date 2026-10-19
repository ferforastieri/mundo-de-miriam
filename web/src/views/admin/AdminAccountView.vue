<template>
  <div>
    <header class="admin-page-header">
      <div>
        <h1 class="admin-title">Minha conta</h1>
        <p class="admin-subtitle">
          Sua foto no painel e a senha de acesso.
        </p>
      </div>
    </header>

    <div class="admin-grid-2">
      <section class="admin-card">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title"><AdminIcon name="camera" /> Foto do perfil</h2>
            <p class="admin-card__hint">Aparece no canto do painel e no menu.</p>
          </div>
        </div>

        <div class="account-avatar">
          <img
            v-if="admin?.avatarUrl"
            class="account-avatar__image"
            :src="admin.avatarUrl"
            alt="Sua foto"
          />
          <span v-else class="account-avatar__initials">{{ initials }}</span>
        </div>

        <div class="admin-actions-row">
          <label class="admin-btn admin-btn--primary admin-btn--small account-upload">
            <AdminIcon name="upload" />
            {{ uploading ? 'Enviando…' : 'Trocar foto' }}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              hidden
              :disabled="uploading"
              @change="handleAvatar"
            />
          </label>

          <button
            v-if="admin?.avatarUrl"
            class="admin-btn admin-btn--small admin-btn--danger"
            type="button"
            :disabled="uploading"
            @click="removeAvatar"
          >
            <AdminIcon name="trash" />
            Remover
          </button>
        </div>

        <p class="admin-card__hint">JPG, PNG ou WebP até 20 MB.</p>

        <hr class="admin-separator" />

        <p class="admin-card__hint">
          <strong>{{ admin?.email || '—' }}</strong>
        </p>
      </section>

      <section class="admin-card">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title"><AdminIcon name="key" /> Alterar senha</h2>
            <p class="admin-card__hint">As outras sessões abertas serão encerradas.</p>
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
import AdminIcon from '@/components/admin/AdminIcon.vue'

const { state, loadMe } = useAdminAuth()
const toast = useAdminToast()

const admin = computed(() => state.admin)
const initials = computed(() => (admin.value?.email || 'M').slice(0, 1).toUpperCase())

const uploading = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)

async function handleAvatar(event) {
  const file = event.target.files?.[0]
  event.target.value = ''

  if (!file) return

  uploading.value = true

  try {
    await adminService.uploadAvatar(file)
    await loadMe(true)
    toast.success('Foto atualizada.')
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível enviar a foto.')
  } finally {
    uploading.value = false
  }
}

async function removeAvatar() {
  uploading.value = true

  try {
    await adminService.removeAvatar()
    await loadMe(true)
    toast.success('Foto removida.')
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível remover a foto.')
  } finally {
    uploading.value = false
  }
}

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
.account-avatar {
  display: grid;
  place-items: center;
  width: 132px;
  height: 132px;
  margin: 0.4rem 0 1rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface-muted);
  overflow: hidden;
}

.account-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.account-avatar__initials {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: var(--primary);
  color: var(--on-primary);
  font-family: 'Gilda Display', serif;
  font-size: 3rem;
}

.account-upload {
  position: relative;
  overflow: hidden;
}
</style>
