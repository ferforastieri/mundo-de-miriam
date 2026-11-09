<template>
  <div>
    <AdminSkeleton v-if="isPending" variant="stats" />

    <template v-else>
      <div v-if="!state.configured" class="admin-alert instagram-setup-hint">
        <span>Configure o token para começar a coleta automática das estatísticas.</span>
        <a class="admin-link" href="#configuracoes">Ir para as configurações</a>
      </div>

      <div class="instagram-section__head instagram-section__head--action">
        <div>
          <h2 class="instagram-section__title">Desempenho</h2>
          <p class="instagram-section__hint">Números acumulados do período escolhido e evolução ao longo do tempo</p>
        </div>

        <div class="instagram-section__actions">
          <div class="instagram-period">
            <span class="instagram-period__label">Período</span>
            <AdminSelect
              v-model="selectedDays"
              :options="periodOptions"
              aria-label="Período do Instagram"
            />
          </div>

          <button
            class="admin-btn admin-btn--small"
            type="button"
            :disabled="refreshing"
            @click="refreshNow"
          >
            <AdminIcon name="refresh" />
            {{ refreshing ? 'Atualizando…' : 'Atualizar' }}
          </button>

          <RouterLink class="admin-btn admin-btn--small" :to="{ name: 'AdminPublish' }">
            Publicar no Instagram
          </RouterLink>
        </div>
      </div>

      <section class="admin-card instagram-metrics">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title"><AdminIcon name="activity" /> Insights do período</h2>
            <p class="admin-card__hint">
              <template v-if="period?.source === 'instagram'">
                {{ formatDate(period.from) }} a {{ formatDate(period.to) }} · total oficial do Instagram
              </template>
              <template v-else-if="period?.from">
                {{ formatDate(period.from) }} a {{ formatDate(period.to) }} · {{ formatNumber(period.samples) }} coletas
              </template>
              <template v-else>Nenhuma coleta bem-sucedida ainda</template>
            </p>
          </div>
          <span v-if="latest" class="admin-tag">
            Última coleta {{ formatDateTime(latest.capturedAt) }}
          </span>
        </div>

        <div v-if="latest" class="admin-stats" :style="statsStyle(6)">
          <AdminStatCard icon="users" label="Seguidores" :value="formatNumber(latest.followers)" />
          <AdminStatCard icon="userPlus" label="Seguindo" :value="formatNumber(state.followsCount)" />
          <AdminStatCard icon="image" label="Publicações" :value="formatNumber(latest.posts)" />
          <AdminStatCard
            icon="eye"
            label="Visualizações"
            :value="metric(period?.views)"
            :hint="`últimos ${selectedDays} dias`"
          />
          <AdminStatCard
            icon="activity"
            label="Interações"
            :value="metric(period?.interactions)"
            :hint="`últimos ${selectedDays} dias`"
          />
          <AdminStatCard
            icon="trendingUp"
            label="Seguidores líquidos"
            :value="formatSigned(period?.netFollowers)"
            :hint="`últimos ${selectedDays} dias`"
          />
        </div>

        <p v-else class="admin-empty">
          Configure o token nas configurações abaixo para iniciar o histórico do Instagram.
        </p>

        <div v-if="period && (period.samples > 0 || period.source === 'instagram')" class="instagram-insights">
          <div class="instagram-insight">
            <span class="instagram-insight__label">Engajamento</span>
            <strong class="instagram-insight__value">{{ formatPercent(engagementRate) }}</strong>
            <span class="instagram-insight__hint">interações ÷ visualizações do período</span>
          </div>

          <div class="instagram-insight">
            <span class="instagram-insight__label">Novos seguidores</span>
            <strong class="instagram-insight__value">{{ formatSigned(period.newFollowers) }}</strong>
            <span class="instagram-insight__hint">
              saldo de {{ formatSigned(period.netFollowers) }} no período
            </span>
          </div>

          <div class="instagram-insight">
            <span class="instagram-insight__label">Origem das views</span>
            <strong class="instagram-insight__value">
              {{ period.viewsSource === 'instagram' ? 'Instagram' : period.viewsSource === 'account' ? 'Conta' : period.viewsSource === 'partial' ? 'Misto' : 'Publicações' }}
            </strong>
            <span class="instagram-insight__hint">
              {{
                period.viewsSource === 'instagram'
                  ? 'total oficial do período, igual ao app'
                  : period.viewsSource === 'account'
                    ? 'soma das visualizações diárias da conta'
                    : period.viewsSource === 'partial'
                      ? 'views da conta desde o início da coleta + variação das publicações'
                      : 'variação das views das publicações recentes'
              }}
            </span>
          </div>
        </div>

        <div v-if="period?.followers != null && (period?.samples > 0 || period?.source === 'instagram')" class="instagram-audience">
          <div class="instagram-audience__head">
            <span class="instagram-insight__label">Views por tipo de conta</span>
            <strong class="instagram-audience__value">
              {{ formatPercent(period.followers) }} seguidores
              <span>· {{ formatPercent(period.nonFollowers) }} não seguidores</span>
            </strong>
          </div>
          <div
            class="instagram-audience__bar"
            role="img"
            :aria-label="`${period.followers}% das views de seguidores e ${period.nonFollowers}% de não seguidores`"
          >
            <span :style="{ width: `${period.followers}%` }"></span>
          </div>
        </div>
      </section>

      <div v-if="periodHistory.length >= 2" class="admin-grid-2 instagram-charts">
        <section class="admin-card">
          <AdminSparkline :label="`Seguidores · ${selectedDays} dias`" :values="periodHistory.map((point) => point.followers)" />
        </section>

        <section class="admin-card">
          <AdminSparkline
            :label="`Alcance · ${selectedDays} dias`"
            :values="periodHistory.map((point) => point.reach)"
            color="#2f6f4f"
          />
        </section>

        <section class="admin-card">
          <AdminSparkline
            :label="`Visitas ao perfil · ${selectedDays} dias`"
            :values="periodHistory.map((point) => point.profileViews)"
            color="#3f5f9a"
          />
        </section>

        <section class="admin-card">
          <AdminSparkline
            :label="`Views recentes · ${selectedDays} dias`"
            :values="periodHistory.map((point) => point.recentViews)"
            color="#9a5b2f"
          />
        </section>
      </div>

      <section v-if="hasDemographics" class="admin-card instagram-demographics">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title"><AdminIcon name="users" /> Público (seguidores)</h2>
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
            <h2 class="admin-card__title"><AdminIcon name="image" /> Desempenho por publicação</h2>
            <p class="admin-card__hint">Publicações coletadas da API</p>
          </div>
        </div>

        <AdminSkeleton v-if="mediaPending" variant="photos" :count="6" />

        <p v-else-if="media.length === 0" class="admin-empty">
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

        <PaginationBar
          :pagination="mediaPagination"
          label="publicações"
          @update:page="mediaPage = $event"
        />
      </section>

      <section class="admin-card instagram-history">
        <div class="admin-card__header">
          <div>
            <h2 class="admin-card__title"><AdminIcon name="activity" /> Histórico recente</h2>
            <p class="admin-card__hint">Coletas registradas, incluindo falhas</p>
          </div>
        </div>

        <AdminSkeleton v-if="attemptsPending" variant="cards" :count="1" />

        <p v-else-if="attempts.length === 0" class="admin-empty">Nenhuma tentativa registrada ainda.</p>

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

        <PaginationBar
          :pagination="attemptsPagination"
          label="coletas"
          @update:page="attemptsPage = $event"
        />
      </section>
      <div id="configuracoes" class="instagram-section__head instagram-settings-head">
        <h2 class="instagram-section__title">Configurações</h2>
        <p class="instagram-section__hint">Token, status da integração e renovação automática</p>
      </div>

      <div class="admin-grid-2">
        <section class="admin-card">
          <div class="admin-card__header">
            <div>
              <h2 class="admin-card__title"><AdminIcon name="settings" /> Estado da integração</h2>
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

        </section>

        <section class="admin-card">
          <div class="admin-card__header">
            <div>
              <h2 class="admin-card__title"><AdminIcon name="key" /> Token de acesso</h2>
              <p class="admin-card__hint">
                Cole o token de longa duração da API do Instagram. Ele é criptografado antes de ser salvo.
              </p>
            </div>
          </div>

          <form class="instagram-token-form" @submit.prevent="saveToken">
            <label class="admin-field">
              <span class="admin-label">Novo token</span>
              <div class="instagram-token-form__input">
                <AdminInput v-model="tokenInput"
                  
                  :type="showToken ? 'text' : 'password'"
                  autocomplete="off"
                  spellcheck="false"
                  placeholder="IGQVJ…" />
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
import AdminIcon from '@/components/admin/AdminIcon.vue'
import AdminSelect from '@/components/admin/AdminSelect.vue'
import PaginationBar from '@/components/admin/PaginationBar.vue'
import { statColumns } from '@/utils/grid.js'
import { useErrorToast } from '@/composables/useErrorToast'

function statsStyle(count) {
  return {
    '--stat-cols': statColumns(count, 5),
    '--stat-cols-sm': statColumns(count, 2)
  }
}
import { formatDate, formatDateTime, formatNumber } from '@/utils/format.js'
import AdminInput from '@/components/admin/AdminInput.vue'

const queryClient = useQueryClient()
const toast = useAdminToast()

// O mesmo recorte de período usado no dashboard e no PDF.
const insightDayOptions = [7, 30, 90]
const periodOptions = insightDayOptions.map((days) => ({ value: days, label: `Últimos ${days} dias` }))
const selectedDays = ref(90)
const refreshing = ref(false)

async function refreshNow() {
  if (refreshing.value) return

  refreshing.value = true

  try {
    const result = await adminService.refreshInstagram()

    if (result?.ok) {
      toast.success('Dados do Instagram atualizados.')
      await queryClient.invalidateQueries({ queryKey: ['admin-instagram'] })
      await queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    } else {
      toast.error(result?.message || 'Não foi possível atualizar os dados agora.')
    }
  } catch (error) {
    toast.error(error?.message || 'Não foi possível atualizar os dados agora.')
  } finally {
    refreshing.value = false
  }
}

const {
  data,
  isPending,
  isError,
  error
} = useQuery({
  queryKey: ['admin-instagram', selectedDays],
  queryFn: () => adminService.getInstagram(selectedDays.value)
})

const state = computed(() => data.value?.state || {})

useErrorToast(error, 'Não foi possível carregar os dados do Instagram.')

useErrorToast(
  computed(() => {
    const message = state.value?.lastError
    return message ? new Error(message) : null
  }),
  'Falha na coleta do Instagram.'
)
const latest = computed(() => data.value?.latest || null)
const history = computed(() => data.value?.history || [])
const periodHistory = computed(() => history.value.slice(-selectedDays.value))
const refreshWindowDays = computed(() => data.value?.state?.refreshWindowDays || 7)
const demographics = computed(() => data.value?.demographics || {})
const insights = computed(() => data.value?.insights || {})
const period = computed(() => insights.value.selected || null)

const engagementRate = computed(() => {
  const views = Number(period.value?.views)
  const interactions = Number(period.value?.interactions)

  if (!Number.isFinite(views) || views <= 0 || !Number.isFinite(interactions)) return null

  return (interactions / views) * 100
})

const mediaPage = ref(1)
const attemptsPage = ref(1)

const { data: mediaData, isPending: mediaPending } = useQuery({
  queryKey: ['admin-instagram-media', mediaPage],
  queryFn: () => adminService.getInstagramMedia({ page: mediaPage.value, pageSize: 10 })
})

const { data: attemptsData, isPending: attemptsPending } = useQuery({
  queryKey: ['admin-instagram-attempts', attemptsPage],
  queryFn: () => adminService.getInstagramAttempts({ page: attemptsPage.value, pageSize: 10 })
})

const media = computed(() => mediaData.value?.media || [])
const mediaPagination = computed(() => mediaData.value?.pagination || null)
const attempts = computed(() => attemptsData.value?.attempts || [])
const attemptsPagination = computed(() => attemptsData.value?.pagination || null)
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

function formatSigned(value) {
  if (value === null || value === undefined || value === '') return '—'

  const numeric = Number(value)

  if (!Number.isFinite(numeric)) return '—'

  return `${numeric >= 0 ? '+' : ''}${formatNumber(numeric)}`
}

function formatPercent(value) {
  if (value === null || value === undefined) return '—'

  const numeric = Number(value)

  if (!Number.isFinite(numeric)) return '—'

  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(numeric)}%`
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
  margin: 1.5rem 0 1.1rem;
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

.instagram-section__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.instagram-period {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.instagram-period :deep(.admin-select-field) {
  width: 144px;
}

.instagram-period__label {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.instagram-insights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.instagram-insight {
  display: grid;
  align-content: start;
  gap: 0.3rem;
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-muted);
}

.instagram-insight__label {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.instagram-insight__value {
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: 1.5rem;
  font-weight: normal;
  line-height: 1.05;
}

.instagram-insight__hint {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.72rem;
  line-height: 1.4;
}

.instagram-audience {
  margin-top: 1rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--border);
}

.instagram-audience__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.instagram-audience__value {
  color: var(--primary);
  font-family: 'Gilda Display', serif;
  font-size: 1rem;
  font-weight: normal;
}

.instagram-audience__value span {
  color: var(--muted);
  font-family: system-ui, sans-serif;
  font-size: 0.78rem;
}

.instagram-audience__bar {
  height: 8px;
  margin-top: 0.5rem;
  overflow: hidden;
  border-radius: 99px;
  background: var(--border);
}

.instagram-audience__bar span {
  display: block;
  height: 100%;
  border-radius: 99px;
  background: var(--primary);
}

@media (max-width: 720px) {
  .instagram-section__actions {
    width: 100%;
  }

  .instagram-period {
    flex: 1 1 100%;
  }
}
</style>
