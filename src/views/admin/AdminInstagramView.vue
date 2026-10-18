<template>
  <div>
    <header class="admin-page-header">
      <div>
        <h1 class="admin-title">Instagram</h1>
        <p class="admin-subtitle">
          O painel renova o token automaticamente, coleta os números de hora em hora e guarda o histórico no
          banco. O site exibe sempre o último snapshot bem-sucedido, mesmo quando a API do Instagram falha.
        </p>
      </div>

      <div class="admin-actions-row">
        <button class="admin-btn" type="button" :disabled="refreshing || isFetching" @click="refreshNow">
          {{ refreshing ? 'Coletando…' : 'Atualizar agora' }}
        </button>
        <button class="admin-btn" type="button" :disabled="isFetching" @click="refetch">
          {{ isFetching ? 'Atualizando…' : 'Recarregar painel' }}
        </button>
      </div>
    </header>

    <div v-if="isPending" class="admin-card">
      <p class="admin-empty">Carregando dados do Instagram…</p>
    </div>

    <div v-else-if="isError" class="admin-alert admin-alert--error">
      {{ error?.message || 'Não foi possível carregar os dados do Instagram.' }}
    </div>

    <template v-else>
      <div class="admin-grid-2">
        <section class="admin-card">
          <div class="admin-card__header">
            <div>
              <h2 class="admin-card__title">Estado da integração</h2>
              <p class="admin-card__hint">Token e última sincronização</p>
            </div>

            <span v-if="!state.configured" class="admin-tag admin-tag--warning">Não configurado</span>
            <span v-else-if="state.lastError" class="admin-tag admin-tag--danger">Com erro</span>
            <span v-else class="admin-tag admin-tag--success">Conectado</span>
          </div>

          <table class="admin-table">
            <tbody>
              <tr>
                <th>Conta</th>
                <td>{{ state.username ? `@${state.username}` : '—' }}</td>
              </tr>
              <tr>
                <th>Último sucesso</th>
                <td>{{ formatDateTime(state.lastSuccessAt) }}</td>
              </tr>
              <tr>
                <th>Última tentativa</th>
                <td>{{ formatDateTime(state.lastAttemptAt) }}</td>
              </tr>
              <tr>
                <th>Expiração do token</th>
                <td>
                  {{ formatDateTime(state.tokenExpiresAt) }}
                  <span v-if="tokenExpiringSoon" class="admin-tag admin-tag--warning">Renovação automática em breve</span>
                </td>
              </tr>
            </tbody>
          </table>

          <p v-if="state.lastError" class="admin-alert admin-alert--error instagram-error">
            {{ state.lastError }}
          </p>
        </section>

        <section class="admin-card">
          <div class="admin-card__header">
            <div>
              <h2 class="admin-card__title">Token de acesso</h2>
              <p class="admin-card__hint">
                Cole o token de longa duração da API do Instagram. Ele é criptografado antes de ser salvo.
              </p>
            </div>
          </div>

          <form class="instagram-token-form" @submit.prevent="saveToken">
            <label class="admin-field">
              <span class="admin-label">Novo token</span>
              <div class="instagram-token-form__input">
                <input
                  v-model="tokenInput"
                  class="admin-input"
                  :type="showToken ? 'text' : 'password'"
                  autocomplete="off"
                  spellcheck="false"
                  placeholder="IGQVJ…"
                />
                <button class="admin-btn admin-btn--small" type="button" @click="showToken = !showToken">
                  {{ showToken ? 'Ocultar' : 'Mostrar' }}
                </button>
              </div>
            </label>

            <div class="admin-actions-row">
              <button class="admin-btn admin-btn--primary" type="submit" :disabled="savingToken || !tokenInput.trim()">
                {{ savingToken ? 'Validando e salvando…' : 'Salvar token' }}
              </button>
              <button
                v-if="state.configured"
                class="admin-btn admin-btn--danger"
                type="button"
                :disabled="savingToken"
                @click="confirmRemoveToken = true"
              >
                Remover token
              </button>
            </div>
          </form>

          <p class="admin-card__hint instagram-help">
            A renovação usa o endpoint oficial do Instagram e acontece automaticamente nos últimos
            {{ refreshWindowDays }} dias de validade. Se o token for revogado, o site continua exibindo o
            último dado salvo.
          </p>
        </section>
      </div>

      <section class="admin-card instagram-metrics">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title">Último snapshot</h2>
            <p class="admin-card__hint">
              {{ latest ? `Coletado em ${formatDateTime(latest.capturedAt)}` : 'Nenhuma coleta bem-sucedida ainda' }}
            </p>
          </div>
          <span v-if="latest" class="admin-tag">{{ latest.source }}</span>
        </div>

        <div v-if="latest" class="admin-stats">
          <AdminStatCard label="Seguidores" :value="formatNumber(latest.followers)" />
          <AdminStatCard label="Publicações" :value="formatNumber(latest.posts)" />
          <AdminStatCard label="Views recentes" :value="formatNumber(latest.recentViews)" />
          <AdminStatCard label="Interações recentes" :value="formatNumber(latest.recentInteractions)" />
        </div>

        <p v-else class="admin-empty">
          Configure o token acima para iniciar o histórico do Instagram.
        </p>
      </section>

      <div v-if="history.length >= 2" class="admin-grid-2 instagram-charts">
        <section class="admin-card">
          <AdminSparkline label="Seguidores (90 dias)" :values="history.map((point) => point.followers)" />
        </section>

        <section class="admin-card">
          <AdminSparkline
            label="Views recentes (90 dias)"
            :values="history.map((point) => point.recentViews)"
            color="#9a5b2f"
          />
        </section>
      </div>

      <section class="admin-card instagram-history">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title">Histórico recente</h2>
            <p class="admin-card__hint">Últimas coletas registradas, incluindo falhas</p>
          </div>
        </div>

        <p v-if="attempts.length === 0" class="admin-empty">Nenhuma tentativa registrada ainda.</p>

        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Quando</th>
                <th>Origem</th>
                <th>Status</th>
                <th>Seguidores</th>
                <th>Publicações</th>
                <th>Detalhe</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="attempt in attempts" :key="`${attempt.capturedAt}-${attempt.source}`">
                <td>{{ formatDateTime(attempt.capturedAt) }}</td>
                <td>{{ attempt.source }}</td>
                <td>
                  <span class="admin-tag" :class="attempt.success ? 'admin-tag--success' : 'admin-tag--danger'">
                    {{ attempt.success ? 'OK' : 'Falha' }}
                  </span>
                </td>
                <td>{{ attempt.success ? formatNumber(attempt.followers) : '—' }}</td>
                <td>{{ attempt.success ? formatNumber(attempt.posts) : '—' }}</td>
                <td class="instagram-history__detail">{{ attempt.error || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <ConfirmDialog
      :open="confirmRemoveToken"
      title="Remover token do Instagram"
      message="O histórico continuará no banco e o site seguirá exibindo o último snapshot. As próximas coletas automáticas ficam pausadas até você salvar um novo token."
      confirm-label="Remover token"
      :loading="savingToken"
      danger
      @confirm="removeToken"
      @cancel="confirmRemoveToken = false"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import adminService from '@/api/admin/AdminService.js'
import { useAdminToast } from '@/composables/useAdminToast'
import AdminStatCard from '@/components/admin/AdminStatCard.vue'
import AdminSparkline from '@/components/admin/AdminSparkline.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import { formatDateTime, formatNumber } from '@/utils/format.js'

const queryClient = useQueryClient()
const toast = useAdminToast()

const {
  data,
  isPending,
  isError,
  error,
  isFetching,
  refetch
} = useQuery({
  queryKey: ['admin-instagram'],
  queryFn: () => adminService.getInstagram()
})

const state = computed(() => data.value?.state || {})
const latest = computed(() => data.value?.latest || null)
const history = computed(() => data.value?.history || [])
const attempts = computed(() => data.value?.attempts || [])
const refreshWindowDays = computed(() => data.value?.state?.refreshWindowDays || 7)

const tokenExpiringSoon = computed(() => {
  if (!state.value.tokenExpiresAt) return false

  const expiresAt = new Date(state.value.tokenExpiresAt).getTime()
  return expiresAt - Date.now() < 7 * 24 * 60 * 60 * 1000
})

const tokenInput = ref('')
const showToken = ref(false)
const savingToken = ref(false)
const refreshing = ref(false)
const confirmRemoveToken = ref(false)

async function invalidateData() {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['admin-instagram'] }),
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }),
    queryClient.invalidateQueries({ queryKey: ['instagram-stats'] })
  ])
}

async function saveToken() {
  const token = tokenInput.value.trim()
  if (!token) return

  savingToken.value = true

  try {
    const result = await adminService.saveInstagramToken(token)
    tokenInput.value = ''
    showToken.value = false

    if (result?.refresh?.ok) {
      toast.success('Token salvo e primeira coleta concluída.')
    } else {
      toast.success('Token salvo. A coleta será tentada novamente em instantes.')
      if (result?.refresh?.message) toast.error(result.refresh.message)
    }

    await invalidateData()
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível salvar o token.')
  } finally {
    savingToken.value = false
  }
}

async function refreshNow() {
  refreshing.value = true

  try {
    const result = await adminService.refreshInstagram()

    if (result?.ok) {
      toast.success('Dados do Instagram atualizados.')
    } else {
      toast.error(result?.message || 'A coleta do Instagram falhou.')
    }

    await invalidateData()
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível atualizar o Instagram.')
  } finally {
    refreshing.value = false
  }
}

async function removeToken() {
  savingToken.value = true

  try {
    await adminService.deleteInstagramToken()
    confirmRemoveToken.value = false
    toast.success('Token removido.')
    await invalidateData()
  } catch (requestError) {
    toast.error(requestError.message || 'Não foi possível remover o token.')
  } finally {
    savingToken.value = false
  }
}
</script>

<style scoped>
.instagram-error {
  margin: 0.8rem 0 0;
  word-break: break-word;
}

.instagram-token-form {
  display: grid;
  gap: 0.75rem;
}

.instagram-token-form__input {
  display: flex;
  gap: 0.4rem;
}

.instagram-token-form__input .admin-input {
  flex: 1;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8rem;
}

.instagram-help {
  margin-top: 0.9rem;
}

.instagram-metrics {
  margin-top: 1rem;
}

.instagram-charts {
  margin-top: 1rem;
}

.instagram-history {
  margin-top: 1rem;
}

.admin-table-wrap {
  overflow-x: auto;
}

.instagram-history__detail {
  max-width: 320px;
  word-break: break-word;
  color: var(--muted);
}
</style>
