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
        <RouterLink class="admin-btn admin-btn--small" :to="{ name: 'AdminPublish' }">
          Publicar no Instagram
        </RouterLink>
      </div>
    </header>

    <AdminSkeleton v-if="isPending" variant="stats" />

    <div v-else-if="isError" class="admin-alert admin-alert--error">
      {{ error?.message || 'Não foi possível carregar os dados do Instagram.' }}
    </div>

    <template v-else>
      <div v-if="!state.configured" class="admin-alert instagram-setup-hint">
        <span>Configure o token para começar a coleta automática das estatísticas.</span>
        <a class="admin-link" href="#configuracoes">Ir para as configurações</a>
      </div>

      <div class="instagram-section__head">
        <h2 class="instagram-section__title">Desempenho</h2>
        <p class="instagram-section__hint">Números do último dia e evolução ao longo do tempo</p>
      </div>

      <section class="admin-card instagram-metrics">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title">Números do último snapshot</h2>
            <p class="admin-card__hint">
              {{ latest ? `Coletado em ${formatDateTime(latest.capturedAt)}` : 'Nenhuma coleta bem-sucedida ainda' }}
            </p>
          </div>
          <span v-if="latest" class="admin-tag">{{ latest.source }}</span>
        </div>

        <div v-if="latest" class="admin-stats" :style="statsStyle(10)">
          <AdminStatCard label="Seguidores" :value="formatNumber(latest.followers)" />
          <AdminStatCard label="Publicações" :value="formatNumber(latest.posts)" />
          <AdminStatCard label="Alcance" :value="metric(latest.reach)" hint="último dia" />
          <AdminStatCard label="Visitas ao perfil" :value="metric(latest.profileViews)" hint="último dia" />
          <AdminStatCard label="Contas engajadas" :value="metric(latest.accountsEngaged)" hint="último dia" />
          <AdminStatCard label="Novos seguidores" :value="metric(latest.newFollowers)" hint="último dia" />
          <AdminStatCard label="Salvamentos" :value="metric(latest.saves)" hint="último dia" />
          <AdminStatCard label="Compartilhamentos" :value="metric(latest.shares)" hint="último dia" />
          <AdminStatCard label="Interações totais" :value="metric(latest.totalInteractions)" hint="último dia" />
          <AdminStatCard label="Cliques no site" :value="metric(latest.websiteClicks)" hint="último dia" />
        </div>

        <p v-else class="admin-empty">
          Configure o token nas configurações abaixo para iniciar o histórico do Instagram.
        </p>
      </section>

      <div v-if="history.length >= 2" class="admin-grid-2 instagram-charts">
        <section class="admin-card">
          <AdminSparkline label="Seguidores" :values="history.map((point) => point.followers)" />
        </section>

        <section class="admin-card">
          <AdminSparkline
            label="Alcance"
            :values="history.map((point) => point.reach)"
            color="#2f6f4f"
          />
        </section>

        <section class="admin-card">
          <AdminSparkline
            label="Visitas ao perfil"
            :values="history.map((point) => point.profileViews)"
            color="#3f5f9a"
          />
        </section>

        <section class="admin-card">
          <AdminSparkline
            label="Views recentes"
            :values="history.map((point) => point.recentViews)"
            color="#9a5b2f"
          />
        </section>
      </div>

      <section v-if="hasDemographics" class="admin-card instagram-demographics">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title">Público (seguidores)</h2>
            <p class="admin-card__hint">Top cidades, países, idade e gênero — disponível para contas com 100+ seguidores</p>
          </div>
        </div>

        <div class="instagram-demographics__grid">
          <div>
            <h3 class="instagram-demographics__title">Cidades</h3>
            <ul class="instagram-demographics__list">
              <li v-for="item in topDemographics('city')" :key="item.key">
                <span>{{ item.key }}</span><strong>{{ metric(item.value) }}</strong>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="instagram-demographics__title">Países</h3>
            <ul class="instagram-demographics__list">
              <li v-for="item in topDemographics('country')" :key="item.key">
                <span>{{ item.key }}</span><strong>{{ metric(item.value) }}</strong>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="instagram-demographics__title">Faixa etária</h3>
            <ul class="instagram-demographics__list">
              <li v-for="item in topDemographics('age', 6)" :key="item.key">
                <span>{{ item.key }}</span><strong>{{ metric(item.value) }}</strong>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="instagram-demographics__title">Gênero</h3>
            <ul class="instagram-demographics__list">
              <li v-for="item in topDemographics('gender', 4)" :key="item.key">
                <span>{{ item.key }}</span><strong>{{ metric(item.value) }}</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="admin-card instagram-media">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title">Desempenho por publicação</h2>
            <p class="admin-card__hint">Últimas 12 publicações coletadas da API</p>
          </div>
        </div>

        <p v-if="media.length === 0" class="admin-empty">
          Nenhuma publicação coletada ainda. Isso aparece depois da primeira coleta com o token ativo.
        </p>

        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Publicado</th>
                <th>Tipo</th>
                <th>Curtidas</th>
                <th>Comentários</th>
                <th>Views</th>
                <th>Alcance</th>
                <th>Salvos</th>
                <th>Shares</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in media" :key="item.id">
                <td>{{ formatDateTime(item.publishedAt) }}</td>
                <td>{{ mediaTypeLabel(item.mediaType) }}</td>
                <td>{{ metric(item.likeCount) }}</td>
                <td>{{ metric(item.commentsCount) }}</td>
                <td>{{ metric(item.views) }}</td>
                <td>{{ metric(item.reach) }}</td>
                <td>{{ metric(item.saves) }}</td>
                <td>{{ metric(item.shares) }}</td>
                <td>
                  <a v-if="item.permalink" class="admin-link" :href="item.permalink" target="_blank" rel="noopener noreferrer">Abrir</a>
                  <span v-else>—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

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
      <div id="configuracoes" class="instagram-section__head instagram-settings-head">
        <h2 class="instagram-section__title">Configurações</h2>
        <p class="instagram-section__hint">Token, status da integração e renovação automática</p>
      </div>

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
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import { statColumns } from '@/utils/grid.js'

function statsStyle(count) {
  return {
    '--stat-cols': statColumns(count, 5),
    '--stat-cols-sm': statColumns(count, 2)
  }
}
import { formatDateTime, formatNumber } from '@/utils/format.js'

const queryClient = useQueryClient()
const toast = useAdminToast()

const {
  data,
  isPending,
  isError,
  error
} = useQuery({
  queryKey: ['admin-instagram'],
  queryFn: () => adminService.getInstagram()
})

const state = computed(() => data.value?.state || {})
const latest = computed(() => data.value?.latest || null)
const history = computed(() => data.value?.history || [])
const attempts = computed(() => data.value?.attempts || [])
const refreshWindowDays = computed(() => data.value?.state?.refreshWindowDays || 7)
const media = computed(() => data.value?.media || [])
const demographics = computed(() => data.value?.demographics || {})
const hasDemographics = computed(() => Object.keys(demographics.value).length > 0)

const MEDIA_TYPE_LABELS = {
  IMAGE: 'Foto',
  CAROUSEL_ALBUM: 'Carrossel',
  VIDEO: 'Vídeo',
  REELS: 'Reels'
}

function mediaTypeLabel(type) {
  return MEDIA_TYPE_LABELS[type] || type || '—'
}

function topDemographics(breakdown, limit = 5) {
  return (demographics.value[breakdown] || []).slice(0, limit)
}

function metric(value) {
  if (value === null || value === undefined) return '—'
  return formatNumber(value)
}

const tokenExpiringSoon = computed(() => {
  if (!state.value.tokenExpiresAt) return false

  const expiresAt = new Date(state.value.tokenExpiresAt).getTime()
  return expiresAt - Date.now() < 7 * 24 * 60 * 60 * 1000
})

const tokenInput = ref('')
const showToken = ref(false)
const savingToken = ref(false)
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
.instagram-setup-hint {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.instagram-section__head {
  margin: 1.5rem 0 0.75rem;
}

.instagram-section__head:first-of-type {
  margin-top: 0;
}

.instagram-section__title {
  margin: 0;
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: 1.4rem;
  font-weight: normal;
  letter-spacing: 0.02em;
}

.instagram-section__hint {
  margin: 0.2rem 0 0;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
}

.instagram-settings-head {
  margin-top: 2.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border);
}

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

.instagram-demographics {
  margin-top: 1rem;
}

.instagram-demographics__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.instagram-demographics__title {
  margin: 0 0 0.5rem;
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.instagram-demographics__list {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: system-ui, sans-serif;
  font-size: 0.82rem;
}

.instagram-demographics__list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid var(--border);
}

.instagram-demographics__list li:last-child {
  border-bottom: 0;
}

.instagram-demographics__list strong {
  color: var(--primary);
}

.instagram-media {
  margin-top: 1rem;
}

.instagram-charts {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 1rem;
}

@media (max-width: 760px) {
  .instagram-charts {
    grid-template-columns: minmax(0, 1fr);
  }
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
